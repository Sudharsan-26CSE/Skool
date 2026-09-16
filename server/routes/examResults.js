import express from 'express';
import { ExamResult } from '../models/ExamResult.js';

const router = express.Router();

// GET all exam results
router.get('/', async (req, res) => {
  try {
    const { student, class: classId, subject, examType, academicYear } = req.query;
    const filter = {};
    if (student) filter.student = student;
    if (classId) filter.class = classId;
    if (subject) filter.subject = subject;
    if (examType) filter.examType = examType;
    if (academicYear) filter.academicYear = academicYear;

    const results = await ExamResult.find(filter)
      .populate('student')
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .sort({ examDate: -1 });
    res.json({ count: results.length, results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exam results', details: err.message });
  }
});

// GET exam result by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.id)
      .populate('student')
      .populate('subject')
      .populate('class');
    if (!result) return res.status(404).json({ error: 'Exam result not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exam result', details: err.message });
  }
});

// POST create exam result
router.post('/', async (req, res) => {
  try {
    const result = new ExamResult(req.body);
    await result.save();
    res.status(201).json({ message: 'Exam result created successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create exam result', details: err.message });
  }
});

// POST bulk create exam results
router.post('/bulk', async (req, res) => {
  try {
    const { results } = req.body;
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: 'Provide an array of results' });
    }
    const created = await ExamResult.insertMany(results);
    res.status(201).json({ message: `${created.length} exam results created`, count: created.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create exam results', details: err.message });
  }
});

// PUT update exam result
router.put('/:id', async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Exam result not found' });
    Object.assign(result, req.body);
    await result.save(); // triggers pre-save hook for percentage
    res.json({ message: 'Exam result updated successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update exam result', details: err.message });
  }
});

// DELETE exam result
router.delete('/:id', async (req, res) => {
  try {
    const result = await ExamResult.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Exam result not found' });
    res.json({ message: 'Exam result deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete exam result', details: err.message });
  }
});

export default router;
