import express from 'express';
import { Subject } from '../models/Subject.js';

const router = express.Router();

// GET all subjects
router.get('/', async (req, res) => {
  try {
    const { class: classId, teacher, isActive } = req.query;
    const filter = {};
    if (classId) filter.class = classId;
    if (teacher) filter.teacher = teacher;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const subjects = await Subject.find(filter)
      .populate('class', 'name section')
      .populate('teacher', 'name email')
      .sort({ name: 1 });
    res.json({ count: subjects.length, subjects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects', details: err.message });
  }
});

// GET subject by ID
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('class')
      .populate('teacher', 'name email');
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subject', details: err.message });
  }
});

// POST create subject
router.post('/', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Subject code already exists' });
    }
    res.status(500).json({ error: 'Failed to create subject', details: err.message });
  }
});

// PUT update subject
router.put('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('class', 'name section')
      .populate('teacher', 'name email');
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json({ message: 'Subject updated successfully', subject });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update subject', details: err.message });
  }
});

// DELETE subject
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete subject', details: err.message });
  }
});

export default router;
