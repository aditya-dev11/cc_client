import * as pdfjs from 'pdfjs-dist';

// Setting the worker source for PDF.js inside the browser environment
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
}

/**
 * Native Browser PDF Text Extractor
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + "\n";
    }
    return fullText.trim();
  } catch (err) {
    console.error("PDF Extraction error:", err);
    throw new Error("Failed to extract text from PDF. Ensure the file is valid.");
  }
}
