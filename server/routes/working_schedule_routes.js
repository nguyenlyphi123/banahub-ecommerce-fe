const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const WorkingSchedule = require('../models/WokingSchedule');

// @route POST /api/working-chedule/create
// @desc create new Working Schedule
// @access private
routes.post('/create', verifyToken.verifyEmployee, async (req, res) => {
  const { date, positions, week } = req.body;

  console.log(req.body);

  if (!date || !positions || !week)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const result = [];

    for (const w of week) {
      const foundDates = date.filter((d) => d.date.includes(w));
      const positionsWithEmployees = [];

      for (const p of positions) {
        const employees = p.employees.filter((e) => {
          const foundDate = foundDates.find((d) => d.employee === e.employee);
          return foundDate !== undefined;
        });

        if (employees.length > 0) {
          positionsWithEmployees.push({
            position: p.position,
            employees: employees,
          });
        }
      }

      result.push({
        date: w,
        positions: positionsWithEmployees,
      });
    }

    const promises = result.map(async (item) => {
      try {
        const newWorkingSchedule = new WorkingSchedule({
          date: item.date,
          positions: item.positions,
        });
        const response = await newWorkingSchedule.save();
        if (!response) {
          throw new Error('Create working-schedule unsuccessfully !!!');
        }
        return response;
      } catch (error) {
        console.log(error);
        throw new Error('Server time out !!!');
      }
    });

    Promise.all(promises)
      .then((responses) => {
        res.json({
          success: true,
          message: 'Create working-schedule successfully !!!',
          responses,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/working-schedule/
// @desc get all Working Schedule
// @access private
routes.get('/', async (req, res) => {
  try {
    const workingSchedule = await WorkingSchedule.find({})
      .populate({
        path: 'positions.position',
        select: 'name',
      })
      .populate('positions.employees.employee');

    if (!workingSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Working Schedule empty !!!',
      });
    }

    res.json({
      success: true,
      workingSchedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Verver time out !!!' });
  }
});

module.exports = routes;
