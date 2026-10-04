const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// @route   GET /api/feedbacks
// @desc    Get all feedbacks
router.get('/', async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, feedbacks });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/feedbacks
// @desc    Create new feedback
router.post('/', async (req, res, next) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
