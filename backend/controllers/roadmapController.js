const Resume = require('../models/Resume');
const JobAnalysis = require('../models/JobAnalysis');
const RoadmapModel = require('../models/Roadmap');
const { flattenSkills } = require('../services/resumeParser');
const { generateRoadmap, generateRoleRecommendations } = require('../services/aiService');

exports.generateCareerRoadmap = async (req, res) => {
  const { resumeId, analysisId, targetRole } = req.body;

  if (!resumeId || !targetRole) {
    return res
      .status(400)
      .json({ message: 'Resume ID and target role are required' });
  }

  const resume = await Resume.findOne({
    _id: resumeId,
    userId: req.user._id,
  });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  const currentSkills = flattenSkills(resume.extractedSkills);
  let missingSkills = [];

  if (analysisId) {
    const analysis = await JobAnalysis.findById(analysisId);
    if (analysis) {
      missingSkills = analysis.missingSkills;
    }
  }

  const roadmapData = await generateRoadmap(
    currentSkills,
    missingSkills,
    targetRole
  );

  const structured = roadmapData.structured || {};

  // Sanitize phases from AI to match Mongoose schema
  const sanitizedPhases = (structured.phases || []).map((phase) => ({
    phaseNumber: phase.phaseNumber,
    title: phase.title || '',
    duration: phase.duration || '',
    description: phase.description || '',
    skills: Array.isArray(phase.skills) ? phase.skills.map(String) : [],
    projects: Array.isArray(phase.projects)
      ? phase.projects.map((p) =>
          typeof p === 'string'
            ? { name: p, description: '' }
            : { name: p.name || '', description: p.description || '' }
        )
      : [],
    resources: Array.isArray(phase.resources)
      ? phase.resources.map((r) =>
          typeof r === 'string'
            ? { title: r, type: '', url: '' }
            : { title: r.title || '', type: r.type || '', url: r.url || '' }
        )
      : [],
    certifications: Array.isArray(phase.certifications)
      ? phase.certifications.map(String)
      : [],
    milestones: Array.isArray(phase.milestones)
      ? phase.milestones.map(String)
      : [],
  }));

  const roadmap = await RoadmapModel.create({
    userId: req.user._id,
    resumeId,
    analysisId: analysisId || undefined,
    targetRole,
    currentSkills,
    missingSkills,
    phases: sanitizedPhases,
    interviewPrep: structured.interviewPrep || { topics: [], tips: [] },
    estimatedTimeline: structured.estimatedTimeline || '',
    aiRawResponse: roadmapData.raw,
    summary: structured.summary || '',
  });

  res.status(201).json({
    message: 'Career roadmap generated',
    roadmap,
  });
};

exports.getRoadmaps = async (req, res) => {
  const roadmaps = await RoadmapModel.find({ userId: req.user._id })
    .select('-aiRawResponse')
    .sort({ createdAt: -1 });

  res.json(roadmaps);
};

exports.getRoadmap = async (req, res) => {
  const roadmap = await RoadmapModel.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!roadmap) {
    return res.status(404).json({ message: 'Roadmap not found' });
  }

  res.json(roadmap);
};

exports.getRoleRecommendations = async (req, res) => {
  const { resumeId } = req.params;

  const resume = await Resume.findOne({
    _id: resumeId,
    userId: req.user._id,
  });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  const skills = flattenSkills(resume.extractedSkills);
  const recommendations = await generateRoleRecommendations(skills);

  res.json({ recommendations });
};

exports.getDashboardData = async (req, res) => {
  const userId = req.user._id;

  const latestResume = await Resume.findOne({ userId })
    .select('-parsedText')
    .sort({ createdAt: -1 });

  const latestAnalysis = await JobAnalysis.findOne({ userId })
    .sort({ createdAt: -1 });

  const latestRoadmap = await RoadmapModel.findOne({ userId })
    .select('-aiRawResponse')
    .sort({ createdAt: -1 });

  const analysisCount = await JobAnalysis.countDocuments({ userId });
  const resumeCount = await Resume.countDocuments({ userId });

  const recentAnalyses = await JobAnalysis.find({ userId })
    .select('jobTitle matchScore createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    latestResume,
    latestAnalysis,
    latestRoadmap,
    stats: {
      analysisCount,
      resumeCount,
      latestScore: latestAnalysis?.matchScore || null,
      targetRole: req.user.targetRole || latestRoadmap?.targetRole || '',
    },
    recentAnalyses,
  });
};
