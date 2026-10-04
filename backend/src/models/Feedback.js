const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  ratings: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    teaching: { type: Number, required: true, min: 1, max: 5 },
    support: { type: Number, required: true, min: 1, max: 5 },
    usability: { type: Number, required: true, min: 1, max: 5 },
    facilities: { type: Number, required: true, min: 1, max: 5 },
    placement: { type: Number, required: true, min: 1, max: 5 },
  },
  likes: { type: String },
  improvements: { type: String },
  suggestions: { type: String },
  wouldRecommend: { type: String, enum: ['Yes', 'No'] },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
