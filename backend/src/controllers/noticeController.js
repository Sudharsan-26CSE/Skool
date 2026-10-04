const asyncHandler = require('express-async-handler');
const Notice = require('../models/Notice');

exports.getNotices = asyncHandler(async (req, res) => {
  const { category, audience } = req.query;
  let query = {};
  if (category) query.category = category;
  if (audience) query.audience = { $in: [audience, 'all'] };
  const notices = await Notice.find(query).populate('postedBy', 'name role').sort({ isPinned: -1, createdAt: -1 });
  res.json({ success: true, count: notices.length, notices });
});

exports.getNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate('postedBy', 'name role');
  if (!notice) { res.status(404); throw new Error('Notice not found'); }
  res.json({ success: true, notice });
});

exports.createNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json({ success: true, notice });
});

exports.updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!notice) { res.status(404); throw new Error('Notice not found'); }
  res.json({ success: true, notice });
});

exports.deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findByIdAndDelete(req.params.id);
  if (!notice) { res.status(404); throw new Error('Notice not found'); }
  res.json({ success: true, message: 'Notice deleted' });
});
