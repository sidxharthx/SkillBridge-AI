const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  analyzeJD,
  getAnalyses,
  getAnalysis,
} = require('../controllers/analysisController');

router.post('/analyze', protect, analyzeJD);
router.get('/', protect, getAnalyses);
router.get('/:id', protect, getAnalysis);

module.exports = router;
