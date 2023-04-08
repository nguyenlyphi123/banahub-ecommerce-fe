const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceRequirementSchema = new Schema({
  bill_id: {
    type: Schema.Types.ObjectId,
    ref: 'bill',
  },
  responsible_staff: {
    type: Schema.Types.ObjectId,
    ref: 'employee',
  },
  engineering_staff: {
    type: Schema.Types.ObjectId,
    ref: 'employee',
    default: '',
  },
  export_staff: {
    type: Schema.Types.ObjectId,
    ref: 'employee',
    default: '',
  },
  status: {
    type: String,
    enum: ['Awaiting', 'Exporting', 'Installing', 'Installed', 'Complete'],
    default: 'Awaiting',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  'invoice-requirement',
  InvoiceRequirementSchema,
);
