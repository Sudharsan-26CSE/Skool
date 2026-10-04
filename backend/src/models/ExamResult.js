const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class:       { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  subject:     { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  examType:    { type: String, enum: ['mid-term', 'final', 'quiz', 'unit-test'], required: true },
  maxMarks:    { type: Number, required: true },
  marksObtained:{ type: Number, required: true },
  grade:       { type: String },
  remarks:     { type: String },
  examDate:    { type: Date },
  enteredBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-compute grade
examResultSchema.pre('save', function (next) {
  const pct = (this.marksObtained / this.maxMarks) * 100;
  if (pct >= 90)      this.grade = 'A+';
  else if (pct >= 80) this.grade = 'A';
  else if (pct >= 70) this.grade = 'B+';
  else if (pct >= 60) this.grade = 'B';
  else if (pct >= 50) this.grade = 'C';
  else if (pct >= 40) this.grade = 'D';
  else                this.grade = 'F';
  next();
});

module.exports = mongoose.model('ExamResult', examResultSchema);
