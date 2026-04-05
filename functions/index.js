const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pdf = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

admin.initializeApp();

// -----------------------------------------------------
// GEMINI RESUME PARSER CLOUD FUNCTION
// -----------------------------------------------------

/**
 * Common logic for AI parsing.
 */
async function callGeminiParser(resumeText) {
    const apiKey = functions.config().gemini?.key || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key not configured.');
    }

    const genAI = new GoogleGenAI(apiKey);
    // Use gemini-2.0-flash for high performance & speed.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a professional resume parser for the College Connect Alumni Platform.

Extract the following JSON structure from the provided text:
{
  "headline": "string (e.g. SDE @ Google or Indie Filmmaker)",
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "linkedin": "string"
  },
  "experiences": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string (YYYY-MM)",
      "endDate": "string (YYYY-MM or 'Present')",
      "description": "string",
      "current": boolean
    }
  ],
  "educations": [
    {
      "school": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startYear": "string",
      "endYear": "string"
    }
  ],
  "skills": ["string"],
  "location": "string (City, Country)"
}

Rules:
- Output ONLY valid JSON.
- If a field is missing, use "".
- Use arrays for experiences, educations, and skills.
- For current job, set 'current' to true and 'endDate' to 'Present'.

RESUME TEXT:
"""
${resumeText}
"""
`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
        return JSON.parse(text);
    } catch (err) {
        // Fallback for markdown-wrapped JSON
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
        throw new Error("Failed to parse JSON from AI response.");
    }
}

/**
 * Parses resume text directly.
 */
exports.parseResumeContent = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    if (!data.resumeText) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with resumeText.');
    }

    try {
        console.log("Processing resume text directly.");
        return await callGeminiParser(data.resumeText);
    } catch (err) {
        console.error("parseResumeContent error:", err);
        throw new functions.https.HttpsError('internal', err.message || 'Error parsing resume text');
    }
});

/**
 * Legacy URL base parsing.
 */
exports.parseResume = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    if (!data.resumeUrl) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid resumeUrl.');
    }

    try {
        console.log("Processing resume URL:", data.resumeUrl);
        
        // Fetch and parse PDF
        const response = await fetch(data.resumeUrl);
        const buffer = await response.arrayBuffer();
        const pdfData = await pdf(Buffer.from(buffer));
        const resumeText = pdfData.text;

        if (!resumeText || !resumeText.trim()) {
            throw new functions.https.HttpsError('internal', 'No text extracted from PDF');
        }

        return await callGeminiParser(resumeText);
    } catch (err) {
        console.error("parseResume error:", err);
        throw new functions.https.HttpsError('internal', err.message || 'Error parsing resume');
    }
});

