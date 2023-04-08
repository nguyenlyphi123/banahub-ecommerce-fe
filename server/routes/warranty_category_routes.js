const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const WarrantyCategory = require('../models/Warranty_Category');

// @route POST /api/warranty-category/create
// @desc create new warranty-category
// @access private
routes.post('/create', verifyToken.verifyEmployee, async (req, res) => {
  const { type, name, duration } = req.body;

  if (!type || !name)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const warrantyExists = await WarrantyCategory.findOne({ name });

    if (warrantyExists)
      return res.status(400).json({
        success: false,
        message: 'Warranty_Category already exists !!!',
      });

    const warranty = new WarrantyCategory({ type, name, duration });

    await warranty.save();

    res.json({ success: true, warranty });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/warranty-category
// @desc get all warranty-category
// @access private
routes.get('/', verifyToken.verifyEmployee, async (req, res) => {
  try {
    const warranties = await WarrantyCategory.find({});

    if (!warranties)
      return res
        .status(404)
        .json({ success: false, message: 'Warranty Category empty !!!' });

    res.json({ success: true, warranties });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
