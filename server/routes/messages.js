import express from 'express';
import { Message } from '../models/Message.js';

const router = express.Router();

// GET inbox messages
router.get('/inbox/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.params.userId, isDeletedByReceiver: false })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 });
    res.json({ count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inbox', details: err.message });
  }
});

// GET sent messages
router.get('/sent/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.params.userId, isDeletedBySender: false })
      .populate('receiver', 'name email role')
      .sort({ createdAt: -1 });
    res.json({ count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sent messages', details: err.message });
  }
});

// GET message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .populate('parentMessage');
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch message', details: err.message });
  }
});

// POST send message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
});

// PUT mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message marked as read', data: message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message', details: err.message });
  }
});

// PUT star/unstar message
router.put('/:id/star', async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });
    msg.isStarred = !msg.isStarred;
    await msg.save();
    res.json({ message: `Message ${msg.isStarred ? 'starred' : 'unstarred'}`, data: msg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message', details: err.message });
  }
});

// DELETE message (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.query;
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    if (msg.sender.toString() === userId) msg.isDeletedBySender = true;
    if (msg.receiver.toString() === userId) msg.isDeletedByReceiver = true;

    if (msg.isDeletedBySender && msg.isDeletedByReceiver) {
      await Message.findByIdAndDelete(req.params.id);
    } else {
      await msg.save();
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message', details: err.message });
  }
});

export default router;
