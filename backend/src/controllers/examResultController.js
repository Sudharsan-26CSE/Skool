const asyncHandler = require('express-async-handler');
const ExamResult = require('../models/ExamResult');

exports.getResults = asyncHandler(async (req, res) => {
  const { studentId, classId, subject, examType } = req.query;
  let query = {};
  if (studentId) query.student  = studentId;
  if (classId)   query.class    = classId;
  if (subject)   query.subject  = subject;
  if (examType)  query.examType = examType;
  const results = await ExamResult.find(query)
    .populate('student', 'admissionNo user')
    .populate('subject', 'name code')
    .populate('class',   'name section')
    .sort({ examDate: -1 });
  res.json({ success: true, count: results.length, results });
});

exports.getResult = asyncHandler(async (req, res) => {
  const r = await ExamResult.findById(req.params.id).populate('student subject class');
  if (!r) { res.status(404); throw new Error('Result not found'); }
  res.json({ success: true, result: r });
});

exports.createResult = asyncHandler(async (req, res) => {
  const result = await ExamResult.create({ ...req.body, enteredBy: req.user._id });
  res.status(201).json({ success: true, result });
});

exports.updateResult = asyncHandler(async (req, res) => {
  const result = await ExamResult.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!result) { res.status(404); throw new Error('Result not found'); }
  res.json({ success: true, result });
});

exports.deleteResult = asyncHandler(async (req, res) => {
  const r = await ExamResult.findByIdAndDelete(req.params.id);
  if (!r) { res.status(404); throw new Error('Result not found'); }
  res.json({ success: true, message: 'Result deleted' });
});

// Bulk entry: teacher enters marks for whole class
exports.bulkCreate = asyncHandler(async (req, res) => {
  const { records } = req.body; // [{ student, subject, class, examType, maxMarks, marksObtained, examDate }]
  const results = await ExamResult.insertMany(records.map(r => ({ ...r, enteredBy: req.user._id })));
  res.status(201).json({ success: true, count: results.length, results });
});

// Report card: all subjects for one student
exports.getReportCard = asyncHandler(async (req, res) => {
  const { studentId, examType } = req.params;
  const results = await ExamResult.find({ student: studentId, examType })
    .populate('subject', 'name code credits');
  const totalMarks     = results.reduce((s, r) => s + r.maxMarks, 0);
  const marksObtained  = results.reduce((s, r) => s + r.marksObtained, 0);
  const percentage     = totalMarks ? ((marksObtained / totalMarks) * 100).toFixed(1) : 0;
  res.json({ success: true, results, summary: { totalMarks, marksObtained, percentage } });
});
