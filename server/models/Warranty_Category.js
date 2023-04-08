const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WarrantyCategorySchema = new Schema({
  type: {
    type: Schema.Types.ObjectId,
    ref: 'type',
  },
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 2,
  },
});

module.exports = mongoose.model('warranty-category', WarrantyCategorySchema);
