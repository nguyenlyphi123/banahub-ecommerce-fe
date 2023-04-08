const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const CustomerInfo = require('../models/CustomerInfo');

// @route PUT api/customer/:id
// @desc update customer
// @access private
routes.put(`/deliver/:id`, verifyToken.verifyUser, async (req, res) => {
  const customer_id = req.params.id;

  const { receiver, address, phone_number } = req.body;

  if (!receiver || !address || !phone_number)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    let updateCustomer = {
      receiver,
      address,
      phone_number,
    };

    const response = await CustomerInfo.findOneAndUpdate(
      { customer_id },
      updateCustomer,
    );

    if (!response)
      return res.status(400).json({
        success: false,
        message: 'Customer not found !!!',
      });

    res.json({
      success: true,
      message: 'Update customer uccessfully !!!',
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET api/customer
// @desc get all customer
// @access private
routes.get(`/`, verifyToken.verifyAdmin, async (req, res) => {
  try {
    const customer = await CustomerInfo.find({});

    if (customer.length <= 0)
      return res
        .status(404)
        .json({ success: false, message: 'Customer is empty !!!' });

    res.json({ success: true, customer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET api/customer/:id
// @desc get customer by id
// @access private
routes.get(`/:id`, verifyToken.verifyUser, async (req, res) => {
  const customer_id = req.params.id;

  try {
    const customer = await CustomerInfo.findOne({ customer_id });

    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: 'Customer not exist !!!' });

    res.json({ success: true, customer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
