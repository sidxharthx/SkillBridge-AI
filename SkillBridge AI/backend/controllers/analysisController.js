const Resume = require('../models/Resume');
const JobAnalysis = require('../models/JobAnalysis');
const { extractJDKeywords, calculateMatch } = require('../services/skillMatcher');
const { flattenSkills } = require('../services/resumeParser');
const { generateSkillGapExplanation } = require('../services/aiService');

exports.analyzeJD = async (req, res) => {
  const { resumeId, jdText, jobTitle } = req.body;

  if (!resumeId || !jdText) {
    return res
      .status(400)
      .json({ message: 'Resume ID and job description text are required' });
  }

  if (jdText.trim().length < 30) {
    return res
      .status(400)
      .json({ message: 'Job description is too short for meaningful analysis' });
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    userId: req.user._id,
  });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  const resumeSkills = flattenSkills(resume.extractedSkills);
  const jdKeywords = extractJDKeywords(jdText);

  const matchResult = calculateMatch(
    resumeSkills,
    jdKeywords,
    resume.projects
  );

  let aiSummary = '';
  let recommendations = [];
  try {
    aiSummary = await generateSkillGapExplanation(
      matchResult.matchedSkills,
      matchResult.missingSkills,
      jobTitle || 'the target role'
    );
    recommendations = extractRecommendations(aiSummary);
  } catch (aiErr) {
    console.warn('AI analysis failed, continuing with rule-based results:', aiErr.message);
  }

  const analysis = await JobAnalysis.create({
    userId: req.user._id,
    resumeId,
    jdText,
    jobTitle: jobTitle || '',
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,
    partialMatches: matchResult.partialMatches,
    matchScore: matchResult.matchScore,
    scoreBreakdown: matchResult.scoreBreakdown,
    aiSummary,
    recommendations,
  });

  res.status(201).json({
    message: 'Analysis complete',
    analysis,
  });
};

exports.getAnalyses = async (req, res) => {
  const analyses = await JobAnalysis.find({ userId: req.user._id })
    .select('-jdText -aiSummary')
    .populate('resumeId', 'fileName')
    .sort({ createdAt: -1 });

  res.json(analyses);
};

exports.getAnalysis = async (req, res) => {
  const analysis = await JobAnalysis.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate('resumeId', 'fileName extractedSkills');

  if (!analysis) {
    return res.status(404).json({ message: 'Analysis not found' });
  }

  res.json(analysis);
};

function extractRecommendations(aiText) {
  if (!aiText) return [];
  const lines = aiText.split('\n').filter((l) => l.trim().startsWith('-') || /^\d+\./.test(l.trim()));
  return lines.slice(0, 10).map((l) => l.replace(/^[-\d.)\s]+/, '').trim());
}
