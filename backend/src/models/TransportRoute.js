const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  route: { type: String, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TransportRoute', transportRouteSchema);
