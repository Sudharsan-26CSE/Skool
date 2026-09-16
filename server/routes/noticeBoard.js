import express from 'express';
import { NoticeBoard } from '../models/NoticeBoard.js';

const router = express.Router();

// GET all notices
router.get('/', async (req, res) => {
  try {
    const { category, role, isPinned } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (role) filter.targetRoles = { $in: [role, 'all'] };
    if (isPinned !== undefined) filter.isPinned = isPinned === 'true';

    const notices = await NoticeBoard.find(filter)
      .populate('postedBy', 'name role')
      .sort({ isPinned: -1, createdAt: -1 });
    res.json({ count: notices.length, notices });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices', details: err.message });
  }
});

// GET notice by ID
router.get('/:id', async (req, res) => {
  try {
    const notice = await NoticeBoard.findById(req.params.id).populate('postedBy', 'name role');
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notice', details: err.message });
  }
});

// POST create notice
router.post('/', async (req, res) => {
  try {
    const notice = new NoticeBoard(req.body);
    await notice.save();
    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice', details: err.message });
  }
});

// PUT update notice
router.put('/:id', async (req, res) => {
  try {
    const notice = await NoticeBoard.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('postedBy', 'name role');
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json({ message: 'Notice updated successfully', notice });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notice', details: err.message });
  }
});

// DELETE notice
router.delete('/:id', async (req, res) => {
  try {
    const notice = await NoticeBoard.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice', details: err.message });
  }
});

export default router;
