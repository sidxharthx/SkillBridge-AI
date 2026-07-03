const { REVERSE_LOOKUP } = require('../utils/skillDictionary');

/**
 * Normalize a text block: lowercase, remove extra whitespace.
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.+#\-/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract important keywords/skills from JD text.
 */
function extractJDKeywords(jdText) {
  const normalized = normalizeText(jdText);
  const found = new Set();

  for (const [term, info] of REVERSE_LOOKUP) {
    if (term.length < 2) continue;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(normalized)) {
      found.add(info.canonical.toLowerCase());
    }
  }

  return Array.from(found);
}

/**
 * Calculate match between resume skills and JD keywords.
 *
 * Returns:
 *   - matchedSkills: skills found in both resume and JD
 *   - missingSkills: skills in JD but not in resume
 *   - partialMatches: near matches based on substring/similar tokens
 *   - scoreBreakdown: transparent scoring object
 *   - matchScore: final score 0-100
 */
function calculateMatch(resumeSkills, jdKeywords, projects = []) {
  const resumeSet = new Set(resumeSkills.map((s) => s.toLowerCase()));
  const jdSet = new Set(jdKeywords.map((s) => s.toLowerCase()));

  const matchedSkills = [];
  const missingSkills = [];
  const partialMatches = [];

  for (const jdSkill of jdSet) {
    if (resumeSet.has(jdSkill)) {
      matchedSkills.push(jdSkill);
    } else {
      let found = false;
      for (const resumeSkill of resumeSet) {
        if (
          resumeSkill.includes(jdSkill) ||
          jdSkill.includes(resumeSkill) ||
          levenshteinSimilarity(resumeSkill, jdSkill) > 0.75
        ) {
          partialMatches.push({
            resumeSkill,
            jdSkill,
            similarity: levenshteinSimilarity(resumeSkill, jdSkill),
          });
          found = true;
          break;
        }
      }
      if (!found) {
        missingSkills.push(jdSkill);
      }
    }
  }

  const totalJDSkills = jdSet.size || 1;

  const coreSkillsScore = Math.round((matchedSkills.length / totalJDSkills) * 60);
  const secondarySkillsScore = Math.round(
    (partialMatches.length / totalJDSkills) * 20
  );
  const missingPenalty = Math.round(
    (missingSkills.length / totalJDSkills) * 15
  );

  let projectBonus = 0;
  if (projects && projects.length > 0) {
    const projectTechs = projects
      .flatMap((p) => (p.technologies || []).map((t) => t.toLowerCase()));
    const projectOverlap = projectTechs.filter((t) => jdSet.has(t)).length;
    projectBonus = Math.min(projectOverlap * 3, 15);
  }

  const totalScore = Math.max(
    0,
    Math.min(100, coreSkillsScore + secondarySkillsScore - missingPenalty + projectBonus)
  );

  return {
    matchedSkills,
    missingSkills,
    partialMatches,
    matchScore: totalScore,
    scoreBreakdown: {
      coreSkillsScore,
      secondarySkillsScore,
      missingPenalty,
      projectBonus,
      totalScore,
    },
  };
}

/**
 * Simple Levenshtein-based similarity between two strings (0-1).
 */
function levenshteinSimilarity(a, b) {
  const matrix = [];
  const lenA = a.length;
  const lenB = b.length;

  if (lenA === 0) return lenB === 0 ? 1 : 0;
  if (lenB === 0) return 0;

  for (let i = 0; i <= lenB; i++) matrix[i] = [i];
  for (let j = 0; j <= lenA; j++) matrix[0][j] = j;

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLen = Math.max(lenA, lenB);
  return 1 - matrix[lenB][lenA] / maxLen;
}

module.exports = {
  normalizeText,
  extractJDKeywords,
  calculateMatch,
};
