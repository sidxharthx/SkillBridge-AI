const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateCareerRoadmap,
  getRoadmaps,
  getRoadmap,
  getRoleRecommendations,
  getDashboardData,
} = require('../controllers/roadmapController');

router.post('/generate', protect, generateCareerRoadmap);
router.get('/', protect, getRoadmaps);
router.get('/dashboard', protect, getDashboardData);
router.get('/recommendations/:resumeId', protect, getRoleRecommendations);
router.get('/:id', protect, getRoadmap);

module.exports = router;
