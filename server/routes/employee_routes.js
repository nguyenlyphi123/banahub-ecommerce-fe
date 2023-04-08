const express = require('express');
const routes = express.Router();

const verifyToken = require('../middleware/auth');

const Employee = require('../models/Employee');

// @route POST api/position/create
// @desc create new Position
// @access private
routes.post('/create', verifyToken.verifyAdmin, async (req, res) => {
  const { employee_id, name, email, address, phone_number, position } =
    req.body;

  if (!name || !employee_id || !email || !address || !phone_number || !position)
    return res
      .status(404)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const newEmployee = new Employee({
      name,
      employee_id,
      email,
      address,
      phone_number,
      position,
    });

    await newEmployee.save();

    res.json({
      success: true,
      message: 'Create Employee Successfully !!!',
      newEmployee,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT api/employee/update/:id
// @desc update employee
// @access private
routes.put(`/update/:id`, async (req, res) => {
  const employee_id = req.params.id;

  const { name, email, address, phone_number } = req.body;

  if (!name || !email || !address || !phone_number)
    return res
      .status(404)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    let updateEmployee = {
      name,
      email,
      address,
      phone_number,
    };

    const response = await Employee.findOneAndUpdate(
      { employee_id },
      updateEmployee,
    );

    if (!response)
      return res.status(404).json({
        success: false,
        message: 'Employee not found !!!',
      });

    res.json({
      success: true,
      message: 'Update employee successfully !!!',
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET api/employee/
// @desc get all employee
// @access private
routes.get('/', async (req, res) => {
  try {
    const employee = await Employee.find({}).populate('position');

    if (!employee)
      return res.status(404).json({
        success: false,
        message: 'Employee not found !!!',
      });

    res.json({ success: true, employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
