const mongoose = require('mongoose');

const matkaTitliSchema = new mongoose.Schema({
  agentId: {
    type: String,
    required: true
  },
  totalLena: {
    type: Number,
    required: true,
    default: 0
  },
  totalDena: {
    type: Number,
    required: true,
    default: 0
  },
  totalCom: {
    type: Number,
    required: true,
    default: 0
  },
  acceptedAt: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  netAmount: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('MatkaTitli', matkaTitliSchema);
