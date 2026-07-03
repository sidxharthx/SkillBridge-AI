const { PDFParse } = require('pdf-parse');
const { REVERSE_LOOKUP } = require('../utils/skillDictionary');

/**
 * Extract text from a PDF buffer.
 */
async function extractTextFromPDF(filePath) {
  const fs = require('fs');
  const buffer = fs.readFileSync(filePath);
  const uint8 = new Uint8Array(buffer);
  const parser = new PDFParse(uint8);
  await parser.load();
  const result = await parser.getText();
  return result.text;
}

/**
 * Heuristically parse resume sections from raw text.
 */
function parseSections(rawText) {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  const sections = {
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    summary: '',
  };

  const sectionHeaders = {
    skills: /^(technical\s+)?skills|technologies|tech\s+stack|competencies/i,
    education: /^education|academic|qualification/i,
    experience: /^(work\s+)?experience|employment|professional\s+experience|work\s+history/i,
    projects: /^projects|personal\s+projects|academic\s+projects/i,
    certifications: /^certifications?|licenses?|credentials?|courses?/i,
    summary: /^(professional\s+)?summary|objective|about\s+me|profile/i,
  };

  let currentSection = null;
  let currentBlock = [];

  for (const line of lines) {
    let matched = false;
    for (const [section, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(line)) {
        if (currentSection && currentBlock.length > 0) {
          assignToSection(sections, currentSection, currentBlock);
        }
        currentSection = section;
        currentBlock = [];
        matched = true;
        break;
      }
    }
    if (!matched && currentSection) {
      currentBlock.push(line);
    }
  }

  if (currentSection && currentBlock.length > 0) {
    assignToSection(sections, currentSection, currentBlock);
  }

  return sections;
}

function assignToSection(sections, sectionName, block) {
  const text = block.join('\n');

  switch (sectionName) {
    case 'skills':
      sections.skills = block;
      break;
    case 'education':
      sections.education = parseEducation(block);
      break;
    case 'experience':
      sections.experience = parseExperience(block);
      break;
    case 'projects':
      sections.projects = parseProjects(block);
      break;
    case 'certifications':
      sections.certifications = block.filter((l) => l.length > 2);
      break;
    case 'summary':
      sections.summary = text;
      break;
  }
}

function parseEducation(lines) {
  const entries = [];
  let current = {};

  for (const line of lines) {
    const yearMatch = line.match(/(\d{4})\s*[-–]\s*(\d{4}|present)/i);
    const degreeMatch = line.match(/(b\.?tech|b\.?e|m\.?tech|m\.?s|m\.?b\.?a|b\.?sc|m\.?sc|ph\.?d|bachelor|master|diploma|associate)/i);

    if (degreeMatch) {
      if (current.degree) entries.push(current);
      current = { degree: line, institution: '', year: '' };
    } else if (yearMatch) {
      current.year = yearMatch[0];
    } else if (line.length > 3 && !current.institution) {
      current.institution = line;
    }
  }
  if (current.degree) entries.push(current);
  return entries;
}

function parseExperience(lines) {
  const entries = [];
  let current = null;
  const descLines = [];

  for (const line of lines) {
    const dateMatch = line.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|present|current)/i);
    const titleMatch = line.match(/(engineer|developer|analyst|manager|intern|designer|architect|consultant|lead|specialist|coordinator)/i);

    if (titleMatch && !current) {
      current = { title: line, company: '', duration: '', description: '' };
    } else if (dateMatch && current) {
      current.duration = dateMatch[0];
    } else if (current) {
      descLines.push(line);
    }

    if (current && line === lines[lines.length - 1]) {
      current.description = descLines.join(' ');
      entries.push(current);
    }
  }

  if (entries.length === 0 && lines.length > 0) {
    entries.push({
      title: lines[0],
      company: lines[1] || '',
      duration: '',
      description: lines.slice(2).join(' '),
    });
  }

  return entries;
}

function parseProjects(lines) {
  const entries = [];
  let current = null;

  for (const line of lines) {
    if (line.length > 5 && (line.endsWith(':') || /^[A-Z]/.test(line))) {
      if (current) entries.push(current);
      current = { name: line.replace(/:$/, ''), description: '', technologies: [] };
    } else if (current) {
      const techMatch = line.match(/tech(nologies|stack)?:?\s*(.*)/i);
      if (techMatch) {
        current.technologies = techMatch[2]
          .split(/[,|•·]/)
          .map((t) => t.trim())
          .filter(Boolean);
      } else {
        current.description += (current.description ? ' ' : '') + line;
      }
    }
  }
  if (current) entries.push(current);
  return entries;
}

/**
 * Extract skills from the full resume text using the skill dictionary.
 */
function extractSkills(rawText) {
  const textLower = rawText.toLowerCase();
  const found = {
    frontend: [],
    backend: [],
    database: [],
    tools: [],
    cloud: [],
    languages: [],
    softSkills: [],
  };

  const seen = new Set();

  for (const [term, info] of REVERSE_LOOKUP) {
    if (term.length < 2) continue;

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');

    if (regex.test(textLower) && !seen.has(info.canonical.toLowerCase())) {
      seen.add(info.canonical.toLowerCase());
      if (found[info.category]) {
        found[info.category].push(info.canonical);
      }
    }
  }

  return found;
}

/**
 * Get a flat list of all extracted skills.
 */
function flattenSkills(extractedSkills) {
  return Object.values(extractedSkills).flat();
}

module.exports = {
  extractTextFromPDF,
  parseSections,
  extractSkills,
  flattenSkills,
};
