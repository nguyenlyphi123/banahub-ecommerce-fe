const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromotionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  promotion_percent: {
    type: Number,
    required: true,
  },
  rank: {
    type: Schema.Types.ObjectId,
    ref: 'customer-rank',
  },
  start: {
    type: Date,
    default: Date.now,
  },
  end: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  use: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['PROCESSING', 'ACTIVE', 'ENDED'],
    default: 'PROCESSING',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('promotion', PromotionSchema);
