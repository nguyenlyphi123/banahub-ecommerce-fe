const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const WarrantyPursuit = require('../models/Warranty_Pursuit');

// @route POST /api/warranty-pursuit/create
// @desc create new warranty-pursuit
// @access private
routes.post('/create', verifyToken.verifyEmployee, async (req, res) => {
  const { warranty, name, timestamp } = req.body;

  if (!warranty || !name)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const pursuitExists = await WarrantyPursuit.findOne({ name, warranty });

    if (pursuitExists)
      return res.status(400).json({
        success: false,
        message: 'Warranty_Pursuit already exists !!!',
      });

    const pursuit = new WarrantyPursuit({ warranty, name, timestamp });

    await pursuit.save();

    res.json({ success: true, pursuit });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/warranty-pursuit
// @desc get all warranty-pursuit
// @access private
routes.get('/', verifyToken.verifyEmployee, async (req, res) => {
  try {
    const pursuits = await WarrantyPursuit.find({});

    if (!pursuits)
      return res.status(400).json({
        success: false,
        message: 'Warranty_Pursuit empty !!!',
      });

    res.json({ success: true, pursuits });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
