const express = require('express');
const { TRANSFERING, TRANSFERED, COMPLETE } = require('../constants/constants');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const Warranty = require('../models/Warranty');

// @route POST /api/warranty/create
// @desc create new warranty
// @access private
routes.post('/create', verifyToken.verifyEmployee, async (req, res) => {
  const { bill, warranty_list } = req.body;

  if (!bill || !warranty_list)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const warrantyExists = await Warranty.findOne({ bill });

    if (warrantyExists) {
      const warrantyList = warrantyExists.warranty_list;

      const newWarrantyList = warrantyList.concat(
        warranty_list.map((warr) => {
          return {
            product: warr.product,
            warranty_category: null,
            warranty_pursuit: null,
            expected_duration: null,
          };
        }),
      );

      const updateWarranty = {
        bill: warrantyExists.bill,
        warranty_list: newWarrantyList,
      };

      const response = await Warranty.findOneAndUpdate(
        { bill },
        updateWarranty,
        { new: true }, // Return the updated document
      );

      if (!response)
        return res.status(400).json({
          success: false,
          message: 'Can not update warranty_list !!!',
        });

      return res.json({
        success: true,
        message: 'Update warranty successfully !!!',
        response,
      });
    }

    const newWarranty = new Warranty({
      bill,
      warranty_list,
    });

    await newWarranty.save();

    res.json({
      success: true,
      message: 'Create warranty successfully !!!',
      newWarranty,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT /api/warranty/update/checking/:id
// @desc update warranty_list for warranty
// @access private
routes.put(
  '/update/checking/:id',
  verifyToken.verifyEmployee,
  async (req, res) => {
    const warrantyId = req.params.id;
    const { bill, warranty_list } = req.body;

    if (!bill || !warranty_list)
      return res
        .status(400)
        .json({ success: false, message: 'Missing data !!!' });

    try {
      const updatedWarrantyList = warranty_list.map((item) => {
        return {
          ...item,
          status: TRANSFERING,
        };
      });

      const updateWarranty = await Warranty.findByIdAndUpdate(warrantyId, {
        bill,
        warranty_list: updatedWarrantyList,
        status: TRANSFERING,
      });

      if (!updateWarranty)
        return res
          .status(404)
          .json({ success: false, message: 'Warranty not found !!!' });

      res.json({
        success: true,
        message: 'Update warranty successfully !!!',
        updateWarranty,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Server time out !!!' });
    }
  },
);

// @route PUT /api/warranty/update/transfering/:id
// @desc update status of warranty
// @access private
routes.put(
  '/update/transfering/:id',
  verifyToken.verifyEmployee,
  async (req, res) => {
    const warrantyId = req.params.id;

    try {
      const updateWarranty = await Warranty.findByIdAndUpdate(
        warrantyId,
        {
          status: TRANSFERED,
        },
        { new: true },
      );

      if (!updateWarranty)
        return res
          .status(404)
          .json({ success: false, message: 'Warranty not found !!!' });

      res.json({
        success: true,
        message: 'Update warranty successfully !!!',
        updateWarranty,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Server time out !!!' });
    }
  },
);

// @route PUT /api/warranty/update/transfered/:id
// @desc update status of warranty
// @access private
routes.put(
  '/update/transfered/:id',
  verifyToken.verifyEmployee,
  async (req, res) => {
    const warrantyId = req.params.id;

    try {
      const updateWarranty = await Warranty.findByIdAndUpdate(
        warrantyId,
        {
          status: COMPLETE,
        },
        { new: true },
      );

      if (!updateWarranty)
        return res
          .status(404)
          .json({ success: false, message: 'Warranty not found !!!' });

      res.json({
        success: true,
        message: 'Update warranty successfully !!!',
        updateWarranty,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Server time out !!!' });
    }
  },
);

// @route PUT /api/warranty/update/wl/s/:id
// @desc update status of 1 item in warranty_list
// @access private
routes.put('/update/wl/s/:id', verifyToken.verifyEmployee, async (req, res) => {
  const warrantyId = req.params.id;
  const { product } = req.body;

  if (!product)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const warrantyExists = await Warranty.findById(warrantyId);

    const updatedWarrantyList = warrantyExists.warranty_list.map((item) => {
      if (item.product.toString().includes(product)) {
        return {
          ...item.toObject(),
          status: TRANSFERED,
          date_receiving: Date.now(),
        };
      }
      return item.toObject();
    });

    const updateWarranty = await Warranty.findByIdAndUpdate(
      warrantyId,
      {
        warranty_list: updatedWarrantyList,
      },
      { new: true },
    );

    if (!updateWarranty)
      return res
        .status(404)
        .json({ success: false, message: 'Warranty not found !!!' });

    res.json({
      success: true,
      message: 'Update warranty successfully !!!',
      updateWarranty,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/warranty
// @desc get all warranty
// @access private
routes.get('/', verifyToken.verifyEmployee, async (req, res) => {
  try {
    const warranties = await Warranty.find({})
      .populate({
        path: 'bill',
        populate: {
          path: 'customer',
          populate: {
            path: 'customer_id',
            select: 'username',
          },
        },
      })
      .populate({
        path: 'bill',
        populate: {
          path: 'cart_list.product',
          populate: {
            path: 'type',
            select: 'name',
          },
        },
      })
      .populate('warranty_list.product')
      .populate('warranty_list.warranty_category')
      .populate('warranty_list.warranty_pursuit');

    if (!warranties)
      return res
        .status(404)
        .json({ success: false, message: 'Warranty empty !!!' });

    res.json({
      success: true,
      warranties,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
