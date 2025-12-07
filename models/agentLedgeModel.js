const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
 
  client: {
    type: String,
    required: true,
  },
  agentNo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  credit: {
    type: Number,
    default: 0,
  },
  debit: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['cricket', 'football', 'tennis', 'titli'],
    default: 'cricket',
  },
  remark: {
    type: String,
    default: '',
  },
  comType: {
    type: String,
    default: 'match',
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
