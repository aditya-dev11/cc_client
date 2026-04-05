import { useState, useCallback } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../firebase';
import { extractTextFromPDF } from '../utils/pdf-extractor';

/**
 * useResumeParser Hook
 * Refactored to use Firebase Cloud Functions for security.
 */
export function useResumeParser({
    onSuccess,
    onError
} = {}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const parse = useCallback(async (input) => {
        setLoading(true);
        setError(null);

        try {
            // 1. Text Extraction
            let resumeText = "";
            console.log("useResumeParser: Extracting text from input style:", (input instanceof File ? input.type : 'string'));
            
            if (typeof input === 'string') {
                resumeText = input;
            } else if (input instanceof File) {
                if (input.type === 'application/pdf') {
                    resumeText = await extractTextFromPDF(input);
                } else {
                    resumeText = await input.text();
                }
            } else {
                throw new Error("Invalid input. Must be a string or File.");
            }

            console.log(`useResumeParser: Extracted ${resumeText?.length || 0} characters.`);

            if (!resumeText || resumeText.length < 50) {
                console.warn("useResumeParser: Extracted text is too short.");
                throw new Error("Extracted text is too short to be a valid resume.");
            }

            // 2. Call Firebase Cloud Function
            console.log("useResumeParser: Calling parseResumeContent Cloud Function...");
            const parseResumeContent = httpsCallable(functions, 'parseResumeContent');
            
            const result = await parseResumeContent({ resumeText });
            const data = result.data;

            console.log("useResumeParser: Parsed successfully:", data);

            setResult(data);
            if (onSuccess) onSuccess(data);
            return data;

        } catch (err) {
            console.error("useResumeParser Error:", err);
            const errorMessage = err.message || "Failed to parse resume.";
            setError(errorMessage);
            if (onError) onError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [onSuccess, onError]);

    return {
        parse,
        loading,
        error,
        result,
        reset: () => {
            setResult(null);
            setError(null);
        }
    };
}

