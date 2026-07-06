const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  phaseNumber: Number,
  title: String,
  duration: String,
  description: String,
  skills: [String],
  projects: [
    {
      name: String,
      description: String,
    },
  ],
  resources: [
    {
      title: String,
      type: { type: String },
      url: String,
    },
  ],
  certifications: [String],
  milestones: [String],
});

const roadmapSchema = new mongoose.Schema(
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
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobAnalysis',
    },
    targetRole: {
      type: String,
      required: true,
    },
    currentSkills: [String],
    missingSkills: [String],
    phases: [phaseSchema],
    interviewPrep: {
      topics: [String],
      tips: [String],
    },
    estimatedTimeline: String,
    aiRawResponse: String,
    summary: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
