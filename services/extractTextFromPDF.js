const pdf = require('pdf-parse');

async function extractTextFromPDF(buffer) {
  const data = await pdf(buffer);
  return {
    text: data.text || '',
    pageCount: data.numpages || 1
  };
}

export { extractTextFromPDF }; 