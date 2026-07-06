const mongoose = require('mongoose');

const jobAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jdText: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      default: '',
    },
    matchedSkills: [String],
    missingSkills: [String],
    partialMatches: [
      {
        resumeSkill: String,
        jdSkill: String,
        similarity: Number,
      },
    ],
    matchScore: {
      type: Number,
      default: 0,
    },
    scoreBreakdown: {
      coreSkillsScore: Number,
      secondarySkillsScore: Number,
      missingPenalty: Number,
      projectBonus: Number,
      totalScore: Number,
    },
    aiSummary: {
      type: String,
      default: '',
    },
    recommendations: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobAnalysis', jobAnalysisSchema);
