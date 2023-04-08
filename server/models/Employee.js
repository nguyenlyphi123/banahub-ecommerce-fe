const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  employee_id: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  phone_number: {
    type: String,
    default: '',
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'position',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('employee', EmployeeSchema);
