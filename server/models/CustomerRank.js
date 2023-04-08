const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerRankSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model('customer-rank', CustomerRankSchema);
