const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');
const Export = require('../models/Export');

// @router GET api/export
// @desc Get all export
// @access private
routes.get('/', async (req, res) => {
  try {
    const exports = await Export.find({})
      .populate({
        path: 'bill',
        populate: {
          path: 'cart_list.product',
          model: 'product',
        },
      })
      .populate({
        path: 'bill',
        populate: {
          path: 'customer',
          model: 'customer-info',
        },
      })
      .populate('product');

    if (!exports)
      return res
        .status(404)
        .json({ success: false, message: 'Exports data not found !!!' });

    res.json({ success: true, exports });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
