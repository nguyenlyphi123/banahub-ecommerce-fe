const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  describe: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  sold: {
    type: Number,
    default: 0,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'type',
  },
  sub_type: {
    type: Schema.Types.ObjectId,
    ref: 'lower-type',
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'brand',
  },
  image: {
    type: String,
    required: true,
  },
  view: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('product', ProductSchema);
