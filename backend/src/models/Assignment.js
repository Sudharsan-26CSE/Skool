const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  subject:      { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  class:        { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  teacher:      { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  studentName:  { type: String },
  rollNo:       { type: String },
  instructions: { type: String },
  startDate:    { type: Date, default: Date.now },
  dueDate:      { type: Date, required: true },
  attachedFile: { type: String },           // filename/path
  status:       { type: String, enum: ['draft', 'active', 'closed'], default: 'active' },
  submissions:  [{
    student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    fileUrl:     { type: String },
    submittedAt: { type: Date },
    marks:       { type: Number },
    remarks:     { type: String },
    isSubmitted: { type: Boolean, default: false },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
