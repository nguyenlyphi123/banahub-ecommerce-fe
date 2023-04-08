const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const CustomerRank = require('../models/CustomerRank');

// @route POST api/customer_rank/create
// @desc Create new Object for Promotion
// @access private
routes.post('/create', verifyToken.verifyAdmin, async (req, res) => {
  const { name, rank } = req.body;

  if (!name)
    return res
      .status(404)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const customerRankExist = await CustomerRank.findOne({ name });

    if (customerRankExist)
      return res
        .status(400)
        .json({ success: false, message: 'CustomerRank already exist !!!' });

    const newCustomerRank = new CustomerRank({ name, rank });

    await newCustomerRank.save();

    res.json({
      success: true,
      message: 'Create CustomerRank Successfully !!!',
      newCustomerRank,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET api/customerRank
// @desc Get all CustomerRank
// @access private
routes.get('/', async (req, res) => {
  try {
    const customerRank = await CustomerRank.find({});

    if (!customerRank)
      return res.status(404).json({
        success: false,
        message: 'CustomerRank is empty !!!',
      });

    res.json({
      success: true,
      customerRank,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
