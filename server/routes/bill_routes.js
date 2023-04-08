const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const Bill = require('../models/Bill');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');

// @route api/bill/create
// @desc Create new Bill
// @access private
routes.post('/create', verifyToken.verifyUser, async (req, res) => {
  const {
    customer,
    cart_list,
    discount,
    total_cost,
    last_cost,
    payment_methods,
  } = req.body;

  if (!customer || !cart_list || !total_cost)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    // if (!discount) last_cost = total_cost;

    if (cart_list.lenght === 0)
      return res
        .status(400)
        .json({ success: false, message: 'Cart is null !!!' });

    const codeValid = await billCodeValid();

    const newBill = new Bill({
      bill_code: codeValid,
      customer,
      cart_list,
      discount,
      total_cost,
      last_cost,
      payment_methods,
    });

    if (!discount)
      if ((await updateQuantity(cart_list)) === true) {
        await newBill.save();

        return res.json({
          success: true,
          message: 'Create Bill Successfully !!!',
          newBill,
        });
      }

    if (
      (await updateQuantity(cart_list)) === true &&
      (await updatePromotionQuantity(discount)) === true
    ) {
      await newBill.save();

      return res.json({
        success: true,
        message: 'Create Bill Successfully !!!',
        newBill,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: 'Server time out !!!' });
  }
});

// Generate new code
const billCodeValid = async () => {
  let code = (Math.random() + 1).toString(36).substring(5).toUpperCase();

  let isCode = await Bill.findOne({ bill_code: code });
  if (isCode) {
    billCodeValid();
  } else {
    return code;
  }
};

// Update product quantity
const updateQuantity = async (cart_list) => {
  try {
    cart_list.forEach(async (item) => {
      const product = await Product.findOne({
        _id: item.product,
      });

      await Product.findOneAndUpdate(
        { _id: item.product },
        { sold: product.sold + item.quantity },
      );
    });

    return true;
  } catch (error) {
    console.log('Lỗi cập nhật');
    console.log(error);

    return false;
  }
};

// Update promotion quantity
const updatePromotionQuantity = async (promotionId) => {
  try {
    const promotion = await Promotion.findById(promotionId);

    let update;
    if (promotion)
      update = await Promotion.updateOne(
        { _id: promotionId },
        { use: promotion.use + 1 },
      );
    if (update) return true;
  } catch (error) {
    console.log('Lỗi cập nhật');
    console.log(error);

    return false;
  }
};

// @route PUT api/bill/:id
// @desc Update Bill with ObjectId
// @access private
routes.put('/:id', verifyToken.verifyAdmin, async (req, res) => {
  const bill_code = req.params.id;
  const { customer, cart_list, discount, total_cost, payment_methods, status } =
    req.body;

  if (!customer || !cart_list || !total_cost || !payment_methods || !status)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const updateBill = {
      bill_code,
      customer,
      cart_list,
      discount,
      total_cost,
      payment_methods,
      status,
    };

    const bill = await Bill.findOneAndUpdate({ bill_code }, updateBill);

    if (!bill)
      return res.json({
        success: false,
        message: 'Update Bill Unsuccessful !!!',
      });

    res.json({ success: true, message: 'Update Bill Successfully !!!', bill });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route DELETE api/bill/:id
// @desc Delete bill with ObjectId
// @access private
routes.delete('/:id', verifyToken.verifyAdmin, async (req, res) => {
  const bill_id = req.params.id;

  if (!bill_id)
    return res
      .status(400)
      .json({ success: false, message: 'Bill code invalid' });

  try {
    const bill = await Bill.findOneAndDelete({ bill_id });

    if (!bill)
      return res
        .status(400)
        .json({ success: false, message: 'Delete Bill Unsuccessful !!!' });

    res.json({
      success: true,
      message: 'Delete Bill Successfully !!!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/bill
// @desc Get all bill
// @access public
routes.get('/', async (req, res) => {
  try {
    const bills = await Bill.find({})
      .populate('cart_list.product')
      .populate('customer');

    if (!bills)
      return res
        .status(404)
        .json({ success: false, message: 'Bill not found !!!' });

    res.json({ success: true, bills });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/bill
// @desc Get all bill
// @access public
routes.get('/:id', async (req, res) => {
  const bill_code = req.params.id;
  try {
    const bill = await Bill.findOne({ bill_code })
      .populate('customer')
      .populate('cart_list.product');

    if (!bill)
      return res
        .status(404)
        .json({ success: false, message: 'Bill not found !!!' });

    res.json({ success: true, bill });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
