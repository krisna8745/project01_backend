const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  collectionName: {
    type: String,
    required: true,
  },
  debit: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ['CASH A/C', 'BANK A/C'], // extend as needed
    required: true,
  },
  doneBy: {
    type: String,
    required: true,
  },
  agentNo: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('ClientLedger', ledgerSchema);
