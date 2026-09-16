import express from 'express';
import { Notification } from '../models/Notification.js';

const router = express.Router();

// GET notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { isRead, type } = req.query;
    const filter = { user: req.params.userId };
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (type) filter.type = type;

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ user: req.params.userId, isRead: false });
    res.json({ count: notifications.length, unreadCount, notifications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
  }
});

// GET notification by ID
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notification', details: err.message });
  }
});

// POST create notification
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification', details: err.message });
  }
});

// PUT mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification', details: err.message });
  }
});

// PUT mark all as read for a user
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.params.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications', details: err.message });
  }
});

// DELETE notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification', details: err.message });
  }
});

export default router;
