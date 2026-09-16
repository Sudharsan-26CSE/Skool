import express from 'express';
import { Assignment } from '../models/Assignment.js';

const router = express.Router();

// GET all assignments
router.get('/', async (req, res) => {
  try {
    const { class: classId, subject, teacher, status } = req.query;
    const filter = {};
    if (classId) filter.class = classId;
    if (subject) filter.subject = subject;
    if (teacher) filter.teacher = teacher;
    if (status) filter.status = status;

    const assignments = await Assignment.find(filter)
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .populate('teacher', 'name email')
      .sort({ dueDate: -1 });
    res.json({ count: assignments.length, assignments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignments', details: err.message });
  }
});

// GET assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject')
      .populate('class')
      .populate('teacher', 'name email')
      .populate('submissions.student');
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignment', details: err.message });
  }
});

// POST create assignment
router.post('/', async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create assignment', details: err.message });
  }
});

// PUT update assignment
router.put('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .populate('teacher', 'name email');
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ message: 'Assignment updated successfully', assignment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update assignment', details: err.message });
  }
});

// POST submit assignment (student submission)
router.post('/:id/submit', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    assignment.submissions.push(req.body);
    await assignment.save();
    res.status(201).json({ message: 'Assignment submitted successfully', assignment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit assignment', details: err.message });
  }
});

// DELETE assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assignment', details: err.message });
  }
});

export default router;
