const asyncHandler = require('express-async-handler');
const Assignment = require('../models/Assignment');
const multer = require('multer');
const path = require('path');

// Multer storage for assignment files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/assignments/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
exports.upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

exports.getAssignments = asyncHandler(async (req, res) => {
  const { classId, subject, status, teacher } = req.query;
  let query = {};
  if (classId)  query.class   = classId;
  if (subject)  query.subject = subject;
  if (status)   query.status  = status;
  if (teacher)  query.teacher = teacher;
  const assignments = await Assignment.find(query)
    .populate('subject', 'name code')
    .populate('class',   'name section')
    .populate('teacher', 'user')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: assignments.length, assignments });
});

exports.getAssignment = asyncHandler(async (req, res) => {
  const a = await Assignment.findById(req.params.id)
    .populate('subject', 'name code')
    .populate('class',   'name section')
    .populate('submissions.student', 'admissionNo user');
  if (!a) { res.status(404); throw new Error('Assignment not found'); }
  res.json({ success: true, assignment: a });
});

exports.createAssignment = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.attachedFile = req.file.filename;
  const assignment = await Assignment.create(data);
  res.status(201).json({ success: true, assignment });
});

exports.updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!assignment) { res.status(404); throw new Error('Assignment not found'); }
  res.json({ success: true, assignment });
});

exports.deleteAssignment = asyncHandler(async (req, res) => {
  const a = await Assignment.findByIdAndDelete(req.params.id);
  if (!a) { res.status(404); throw new Error('Assignment not found'); }
  res.json({ success: true, message: 'Assignment deleted' });
});

// Student submits assignment
exports.submitAssignment = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) { res.status(404); throw new Error('Assignment not found'); }
  const existingIdx = assignment.submissions.findIndex(s => s.student?.toString() === studentId);
  const submission = {
    student: studentId,
    fileUrl: req.file ? req.file.filename : req.body.fileUrl,
    submittedAt: new Date(),
    isSubmitted: true,
  };
  if (existingIdx > -1) {
    assignment.submissions[existingIdx] = { ...assignment.submissions[existingIdx], ...submission };
  } else {
    assignment.submissions.push(submission);
  }
  await assignment.save();
  res.json({ success: true, message: 'Assignment submitted' });
});

// Teacher grades a submission
exports.gradeSubmission = asyncHandler(async (req, res) => {
  const { studentId, marks, remarks } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  const sub = assignment.submissions.find(s => s.student?.toString() === studentId);
  if (!sub) { res.status(404); throw new Error('Submission not found'); }
  sub.marks   = marks;
  sub.remarks = remarks;
  await assignment.save();
  res.json({ success: true, message: 'Marks saved' });
});
