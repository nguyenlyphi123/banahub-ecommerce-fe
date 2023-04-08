const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LowerTypeSchema = new Schema({
  h_type_id: {
    type: Schema.Types.ObjectId,
    ref: 'type',
  },
  name: {
    type: String,
    unique: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('lower-type', LowerTypeSchema);
