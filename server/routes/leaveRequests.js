import express from 'express';
import { LeaveRequest } from '../models/LeaveRequest.js';

const router = express.Router();

// GET all leave requests
router.get('/', async (req, res) => {
  try {
    const { user, status, leaveType } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (status) filter.status = status;
    if (leaveType) filter.leaveType = leaveType;

    const requests = await LeaveRequest.find(filter)
      .populate('user', 'name email role')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ count: requests.length, leaveRequests: requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave requests', details: err.message });
  }
});

// GET leave request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('approvedBy', 'name');
    if (!request) return res.status(404).json({ error: 'Leave request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave request', details: err.message });
  }
});

// POST create leave request
router.post('/', async (req, res) => {
  try {
    const request = new LeaveRequest(req.body);
    await request.save();
    res.status(201).json({ message: 'Leave request submitted successfully', leaveRequest: request });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit leave request', details: err.message });
  }
});

// PUT update leave request
router.put('/:id', async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Leave request not found' });
    Object.assign(request, req.body);
    await request.save(); // triggers pre-save for totalDays
    res.json({ message: 'Leave request updated successfully', leaveRequest: request });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update leave request', details: err.message });
  }
});

// PUT approve/reject leave request
router.put('/:id/status', async (req, res) => {
  try {
    const { status, approvedBy, adminRemarks } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "approved" or "rejected"' });
    }
    const request = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, approvedBy, approvedDate: new Date(), adminRemarks },
      { new: true, runValidators: true }
    ).populate('user', 'name email role').populate('approvedBy', 'name');

    if (!request) return res.status(404).json({ error: 'Leave request not found' });
    res.json({ message: `Leave request ${status}`, leaveRequest: request });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update leave status', details: err.message });
  }
});

// DELETE leave request
router.delete('/:id', async (req, res) => {
  try {
    const request = await LeaveRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ error: 'Leave request not found' });
    res.json({ message: 'Leave request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete leave request', details: err.message });
  }
});

export default router;
