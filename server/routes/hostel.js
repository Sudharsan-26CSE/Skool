import express from 'express';
import { Hostel } from '../models/Hostel.js';

const router = express.Router();

// GET all hostel rooms
router.get('/', async (req, res) => {
  try {
    const { hostelName, hostelType, roomType, isAvailable } = req.query;
    const filter = { isActive: true };
    if (hostelName) filter.hostelName = hostelName;
    if (hostelType) filter.hostelType = hostelType;
    if (roomType) filter.roomType = roomType;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const rooms = await Hostel.find(filter)
      .populate('occupants.student')
      .populate('warden', 'name email')
      .sort({ hostelName: 1, floor: 1, roomNo: 1 });
    res.json({ count: rooms.length, rooms });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hostel rooms', details: err.message });
  }
});

// GET hostel room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await Hostel.findById(req.params.id)
      .populate('occupants.student')
      .populate('warden', 'name email');
    if (!room) return res.status(404).json({ error: 'Hostel room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hostel room', details: err.message });
  }
});

// POST create hostel room
router.post('/', async (req, res) => {
  try {
    const room = new Hostel(req.body);
    await room.save();
    res.status(201).json({ message: 'Hostel room created successfully', room });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Room already exists in this hostel' });
    }
    res.status(500).json({ error: 'Failed to create hostel room', details: err.message });
  }
});

// PUT update hostel room
router.put('/:id', async (req, res) => {
  try {
    const room = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) return res.status(404).json({ error: 'Hostel room not found' });
    res.json({ message: 'Hostel room updated successfully', room });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hostel room', details: err.message });
  }
});

// DELETE hostel room
router.delete('/:id', async (req, res) => {
  try {
    const room = await Hostel.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ error: 'Hostel room not found' });
    res.json({ message: 'Hostel room deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hostel room', details: err.message });
  }
});

export default router;
