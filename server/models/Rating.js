const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  author: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  content: String,
  rating: {
    type: Number,
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'product',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('rating', RatingSchema);
