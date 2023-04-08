const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerInfoSchema = new Schema({
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  name: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  phone_number: {
    type: String,
    default: '',
  },
  rank: {
    type: Number,
    default: 1,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('customer-info', CustomerInfoSchema);
