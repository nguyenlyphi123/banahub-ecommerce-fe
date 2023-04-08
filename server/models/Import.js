const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImportSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
  },
  quantity: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('import', ImportSchema);
