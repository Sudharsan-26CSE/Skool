const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  vehicleNo:   { type: String, required: true, unique: true },
  driverName:  { type: String, required: true },
  driverPhone: { type: String },
  routeName:   { type: String, required: true },
  capacity:    { type: Number, default: 40 },
  students:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Transport', transportSchema);
