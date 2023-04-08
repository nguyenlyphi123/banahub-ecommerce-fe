const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkingScheduleSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  positions: [
    {
      position: {
        type: Schema.Types.ObjectId,
        ref: 'position',
      },
      employees: [
        {
          employee: {
            type: Schema.Types.ObjectId,
            ref: 'employee',
          },
        },
      ],
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('working-schedule', WorkingScheduleSchema);
