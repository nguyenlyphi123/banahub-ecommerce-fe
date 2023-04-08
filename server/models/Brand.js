const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'type',
  },
  sub_type: {
    type: Schema.Types.ObjectId,
    ref: 'lower-type',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('brand', BrandSchema);
