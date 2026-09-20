const asyncHandler = require('express-async-handler');
const Fee = require('../models/Fee');
const Payroll = require('../models/Payroll');

// ── FEES ─────────────────────────────────────────────────────────
exports.getFees = asyncHandler(async (req, res) => {
  const { status, studentId } = req.query;
  let query = {};
  if (status)    query.status  = status;
  if (studentId) query.student = studentId;
  const fees = await Fee.find(query).populate('student', 'admissionNo user').sort({ createdAt: -1 });
  res.json({ success: true, count: fees.length, fees });
});

exports.getFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findById(req.params.id).populate('student');
  if (!fee) { res.status(404); throw new Error('Fee record not found'); }
  res.json({ success: true, fee });
});

exports.createFee = asyncHandler(async (req, res) => {
  const fee = await Fee.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, fee });
});

exports.updateFee = asyncHandler(async (req, res) => {
  const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!fee) { res.status(404); throw new Error('Fee record not found'); }
  res.json({ success: true, fee });
});

exports.markFeePaid = asyncHandler(async (req, res) => {
  const { paymentMode } = req.body;
  const fee = await Fee.findByIdAndUpdate(
    req.params.id,
    { status: 'paid', paidDate: new Date(), paymentMode: paymentMode || 'cash' },
    { new: true }
  );
  if (!fee) { res.status(404); throw new Error('Fee not found'); }
  res.json({ success: true, fee });
});

exports.getFinanceSummary = asyncHandler(async (req, res) => {
  const fees = await Fee.find();
  const total    = fees.reduce((s, f) => s + f.totalAmount, 0);
  const collected= fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.totalAmount, 0);
  const pending  = fees.filter(f => f.status === 'pending').reduce((s, f) => s + f.totalAmount, 0);
  const overdue  = fees.filter(f => f.status === 'overdue').reduce((s, f) => s + f.totalAmount, 0);
  res.json({ success: true, summary: { total, collected, pending, overdue } });
});

// ── PAYROLL ───────────────────────────────────────────────────────
exports.getPayrolls = asyncHandler(async (req, res) => {
  const { month, year, status } = req.query;
  let query = {};
  if (month)  query.month  = Number(month);
  if (year)   query.year   = Number(year);
  if (status) query.status = status;
  const payrolls = await Payroll.find(query).populate('staff').sort({ createdAt: -1 });
  res.json({ success: true, count: payrolls.length, payrolls });
});

exports.createPayroll = asyncHandler(async (req, res) => {
  const payroll = await Payroll.create({ ...req.body, processedBy: req.user._id });
  res.status(201).json({ success: true, payroll });
});

exports.processPayroll = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findByIdAndUpdate(
    req.params.id,
    { status: 'paid', paidDate: new Date() },
    { new: true }
  );
  if (!payroll) { res.status(404); throw new Error('Payroll not found'); }
  res.json({ success: true, payroll });
});
