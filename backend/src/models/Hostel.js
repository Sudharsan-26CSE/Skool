const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  hostelName:  { type: String, required: true },
  roomNo:      { type: String, required: true },
  roomType:    { type: String, enum: ['single', 'double', 'triple', 'dormitory'], default: 'double' },
  capacity:    { type: Number, default: 2 },
  occupants:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  monthlyFee:  { type: Number, default: 0 },
  floor:       { type: String },
  amenities:   [String],
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Hostel', hostelSchema);
