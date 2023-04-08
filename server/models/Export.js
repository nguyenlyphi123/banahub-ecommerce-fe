const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExportSchema = new Schema({
  bill: {
    type: Schema.Types.ObjectId,
    ref: 'bill',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('export', ExportSchema);
