import { keywordVariants } from "@/data/keywordVariants";

function matchKeyword(text, keyword) {
  const variants = keywordVariants[keyword.toLowerCase()] || [keyword];
  return variants.some(variant => {
    const safe = variant.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${safe}\\b`, 'i');
    return regex.test(text);
  });
}

function scoreResume({ text, pageCount, keywords }) {
  // Normalize text
  text = text.toLowerCase();

  // 1. Section Score (30 pts): +10 each for "education", "skills", "experience"
  const sectionNames = ["education", "skills", "experience"];
  const missingSections = [];
  let sectionScore = 0;

  for (const section of sectionNames) {
    const sectionRegex = new RegExp(`\\b${section}\\b`, 'i');
    if (sectionRegex.test(text)) {
      sectionScore += 10;
    } else {
      missingSections.push(section);
    }
  }

  // 2. Keyword Score (40 pts): match against variants
  let foundKeywords = [];
  let missingKeywords = [];
  let keywordScore = 0;

  if (Array.isArray(keywords)) {
    for (const kw of keywords) {
      if (matchKeyword(text, kw)) {
        foundKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }
    keywordScore = Math.round((foundKeywords.length / keywords.length) * 40);
  }

  // 3. Length Score (20 pts)
  let lengthScore = 0;
  if (pageCount === 1) lengthScore = 20;
  else if (pageCount === 2) lengthScore = 10;

  // 4. Contact Score (10 pts): +5 for email, +5 for phone/LinkedIn
  const emailRegex = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?(\d{3}[-.\s]?\d{3,4}[-.\s]?\d{3,4})/;
  const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+/i;

  const emailFound = emailRegex.test(text);
  const phoneFound = phoneRegex.test(text);
  const linkedinFound = linkedinRegex.test(text);

  console.log("Email match:", emailFound);
  console.log("Phone match:", phoneFound);
  console.log("LinkedIn match:", linkedinFound);

  const contactScore = ((phoneFound || linkedinFound) ? 10 : 0);

  // Final total score
  const totalScore = sectionScore + keywordScore + lengthScore + contactScore;

  return {
    sectionScore,
    keywordScore,
    lengthScore,
    contactScore,
    totalScore,
    foundKeywords,
    missingKeywords,
    missingSections,
    contactDetails: {
      emailFound,
      phoneFound,
      linkedinFound,
    }
  };
}

export { scoreResume };