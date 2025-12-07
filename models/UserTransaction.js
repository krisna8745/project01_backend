const mongoose = require('mongoose');

const userTransactionSchema = new mongoose.Schema({
  userNo: {
    type: String,
    required: true
  },
  agentNo: {
    type: String,
    required: true
  },
  deposit: {
    type: Number,
    default: 0
  },
  withdrawal: {
    type: Number,
    default: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserTransaction', userTransactionSchema);
