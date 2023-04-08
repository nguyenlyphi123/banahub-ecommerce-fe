const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WarrantyPursuitSchema = new Schema({
  warranty: {
    type: Schema.Types.ObjectId,
    ref: 'warranty-category',
  },
  name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    default: 7,
  },
});

module.exports = mongoose.model('warranty-pursuit', WarrantyPursuitSchema);
