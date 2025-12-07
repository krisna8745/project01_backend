const mongoose = require('mongoose');

const excludedMarketSchema = new mongoose.Schema({
  excludedMarketIds: {
    type: [String],
    required: true,
    default: [],
  },
});

const ExcludedMarket = mongoose.model('Marketcontrol', excludedMarketSchema);

module.exports = ExcludedMarket;
