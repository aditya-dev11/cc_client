import * as pdfjsLib from 'pdfjs-dist';
import { GoogleGenAI } from '@google/genai';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Use the local bundled worker via Vite URL import
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export const extractTextFromPDF = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        return fullText;
    } catch (error) {
        console.error("PDF Parsing error:", error);
        throw new Error("Failed to extract text from PDF");
    }
};

export const parseResumeText = async (text) => {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            console.warn("VITE_GEMINI_API_KEY is missing. Falling back to empty parse.");
            return { skills: [], experiences: [], city: '', country: '', rawText: text };
        }

        const prompt = `
You are a resume parser for the *College Connect Alumni Platform*.

Extract the following JSON structure:

{
  "experiences": [
    {
      "companyName": "string",
      "title": "string",
      "startDate": "string", // Strictly YYYY-MM-DD  format. If only year and month, use YYYY-MM-01. E.g., "Feb 2020" -> "2020-02-01".
      "endDate": "string", // Strictly YYYY-MM-DD  format, or 'Present'. If only year and month, use YYYY-MM-01.
      "description": "string"
    }
  ],
  "skills": [
    { "name": "string" }
  ],
  "city": "string", // Infer current city from address or latest job
  "country": "string" // Infer current country from address or latest job
}

Rules:
- Output ONLY valid JSON.
- If a field is missing, use "".
- Use arrays always.
- For city and country, infer from the most recent "Present" job location or contact address.

RESUME TEXT:
"""
${text}
""" 
`;

        const ai = new GoogleGenAI({ apiKey });
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const rawText = result.text;

        try {
            const parsed = JSON.parse(rawText);
            return { ...parsed, rawText: text };
        } catch (err) {
            console.log("⚠ Fixing invalid JSON...");
            const extracted = rawText.match(/\{[\s\S]*\}/);
            const parsed = extracted ? JSON.parse(extracted[0]) : {};
            return { ...parsed, rawText: text };
        }
    } catch (err) {
        console.error("Resume parsing error with Gemini:", err);
        return { skills: [], experiences: [], city: '', country: '', rawText: text };
    }
};
