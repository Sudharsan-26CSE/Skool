import express from 'express';
import { OnlineClass } from '../models/OnlineClass.js';

const router = express.Router();

// GET all online classes
router.get('/', async (req, res) => {
  try {
    const { class: classId, teacher, status } = req.query;
    const filter = {};
    if (classId) filter.class = classId;
    if (teacher) filter.teacher = teacher;
    if (status) filter.status = status;

    const classes = await OnlineClass.find(filter)
      .populate('class', 'name section')
      .populate('subject', 'name code')
      .populate('teacher', 'name email')
      .sort({ scheduledDate: -1 });
    res.json({ count: classes.length, onlineClasses: classes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch online classes', details: err.message });
  }
});

// GET online class by ID
router.get('/:id', async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findById(req.params.id)
      .populate('class')
      .populate('subject')
      .populate('teacher', 'name email')
      .populate('attendees.student');
    if (!onlineClass) return res.status(404).json({ error: 'Online class not found' });
    res.json(onlineClass);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch online class', details: err.message });
  }
});

// POST create online class
router.post('/', async (req, res) => {
  try {
    const onlineClass = new OnlineClass(req.body);
    await onlineClass.save();
    res.status(201).json({ message: 'Online class created successfully', onlineClass });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create online class', details: err.message });
  }
});

// PUT update online class
router.put('/:id', async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('class', 'name section')
      .populate('subject', 'name code')
      .populate('teacher', 'name email');
    if (!onlineClass) return res.status(404).json({ error: 'Online class not found' });
    res.json({ message: 'Online class updated successfully', onlineClass });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update online class', details: err.message });
  }
});

// DELETE online class
router.delete('/:id', async (req, res) => {
  try {
    const onlineClass = await OnlineClass.findByIdAndDelete(req.params.id);
    if (!onlineClass) return res.status(404).json({ error: 'Online class not found' });
    res.json({ message: 'Online class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete online class', details: err.message });
  }
});

export default router;
