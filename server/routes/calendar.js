import express from 'express';
import { SchoolCalendar } from '../models/SchoolCalendar.js';

const router = express.Router();

// GET all calendar events
router.get('/', async (req, res) => {
  try {
    const { type, role, from, to, month, year } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (role) filter.targetRoles = { $in: [role, 'all'] };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    } else if (month && year) {
      const start = new Date(parseInt(year), parseInt(month) - 1, 1);
      const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    const events = await SchoolCalendar.find(filter)
      .populate('createdBy', 'name')
      .sort({ date: 1 });
    res.json({ count: events.length, events });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch calendar events', details: err.message });
  }
});

// GET event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await SchoolCalendar.findById(req.params.id).populate('createdBy', 'name');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event', details: err.message });
  }
});

// POST create event
router.post('/', async (req, res) => {
  try {
    const event = new SchoolCalendar(req.body);
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event', details: err.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const event = await SchoolCalendar.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('createdBy', 'name');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event', details: err.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await SchoolCalendar.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event', details: err.message });
  }
});

export default router;
