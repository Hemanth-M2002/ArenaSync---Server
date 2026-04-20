const express = require('express');
const router = express.Router();
const { generateAIResponse } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimit');

// All AI Routes are protected by JWT Auth AND Rate Limited (35/5min)
router.use(protect);
router.use(aiLimiter);

router.post('/chat', generateAIResponse);

module.exports = router;
