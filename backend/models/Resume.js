const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    parsedText: {
      type: String,
      default: '',
    },
    extractedSkills: {
      frontend: [String],
      backend: [String],
      database: [String],
      tools: [String],
      cloud: [String],
      languages: [String],
      softSkills: [String],
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
      },
    ],
    certifications: [String],
    summary: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
