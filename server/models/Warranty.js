const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WarrantySchema = new Schema({
  bill: {
    type: Schema.Types.ObjectId,
    ref: 'bill',
  },
  warranty_list: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
      },
      warranty_category: {
        type: Schema.Types.ObjectId,
        ref: 'warranty-category',
        default: null,
      },
      warranty_pursuit: {
        type: Schema.Types.ObjectId,
        ref: 'warranty-pursuit',
        default: null,
      },
      expected_duration: {
        type: Number,
        default: null,
      },
      status: {
        type: String,
        enum: ['Confirm', 'Transfering', 'Transfered'],
        default: 'Confirm',
      },
      date_receiving: {
        type: Date,
        default: null,
      },
    },
  ],
  status: {
    type: String,
    enum: ['Confirm', 'Transfering', 'Transfered', 'Complete'],
    default: 'Confirm',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('warranty', WarrantySchema);
