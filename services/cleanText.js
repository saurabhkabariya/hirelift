function cleanText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s\n]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export { cleanText }; 