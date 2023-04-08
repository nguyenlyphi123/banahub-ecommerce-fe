const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  bill_code: {
    type: String,
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customer-info',
  },
  cart_list: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  discount: {
    type: Schema.Types.ObjectId,
    ref: 'promotion',
    default: null,
  },
  total_cost: {
    type: Number,
    required: true,
  },
  last_cost: {
    type: Number,
    default: 0,
  },
  payment_methods: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD',
  },
  status: {
    type: String,
    enum: ['Awaiting', 'Preparing', 'Delivering', 'Delivered', 'Canceled'],
    default: 'Awaiting',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('bill', BillSchema);
