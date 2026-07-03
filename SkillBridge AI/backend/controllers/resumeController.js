const Resume = require('../models/Resume');
const {
  extractTextFromPDF,
  parseSections,
  extractSkills,
} = require('../services/resumeParser');
const { generateResumeSummary } = require('../services/aiService');

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF file' });
  }

  const filePath = req.file.path;
  const rawText = await extractTextFromPDF(filePath);

  if (!rawText || rawText.trim().length < 50) {
    return res.status(400).json({
      message: 'Could not extract text from the PDF. Please ensure it is not scanned/image-based.',
    });
  }

  const sections = parseSections(rawText);
  const extractedSkills = extractSkills(rawText);

  let summary = '';
  try {
    summary = await generateResumeSummary(rawText);
  } catch (aiErr) {
    console.warn('AI summary generation failed, continuing without it:', aiErr.message);
  }

  const resume = await Resume.create({
    userId: req.user._id,
    fileName: req.file.originalname,
    filePath,
    parsedText: rawText,
    extractedSkills,
    education: sections.education,
    experience: sections.experience,
    projects: sections.projects,
    certifications: sections.certifications,
    summary: summary || sections.summary,
  });

  res.status(201).json({
    message: 'Resume uploaded and parsed successfully',
    resume: {
      id: resume._id,
      fileName: resume.fileName,
      extractedSkills: resume.extractedSkills,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      certifications: resume.certifications,
      summary: resume.summary,
      createdAt: resume.createdAt,
    },
  });
};

exports.getResumes = async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id })
    .select('-parsedText')
    .sort({ createdAt: -1 });

  res.json(resumes);
};

exports.getResume = async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  res.json(resume);
};

exports.deleteResume = async (req, res) => {
  const resume = await Resume.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  const fs = require('fs');
  if (resume.filePath && fs.existsSync(resume.filePath)) {
    fs.unlinkSync(resume.filePath);
  }

  res.json({ message: 'Resume deleted' });
};
