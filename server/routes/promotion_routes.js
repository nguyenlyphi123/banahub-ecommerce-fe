const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const Promotion = require('../models/Promotion');
const Bill = require('../models/Bill');

// @route POST api/promotion/create
// @desc create new Promotion
// @access private
routes.post('/create', verifyToken.verifyEmployee, async (req, res) => {
  const { name, promotion_percent, rank, start, end, quantity } = req.body;

  console.log(req.body);

  if (!name || !promotion_percent || !end || !quantity)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const newPromotion = new Promotion({
      name,
      promotion_percent,
      rank,
      start,
      end,
      quantity,
    });

    await newPromotion.save();

    res.json({
      success: true,
      message: 'Create Promotion Successfully !!!',
      newPromotion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).message('Server Time Out !!!');
  }
});

// @route PUT api/promotion/update/:id
// @desc update Promotion
// @access public
routes.put('/update/:id', async (req, res) => {
  const promotion_id = req.params.id;

  const { name, promotion_percent, rank, start, end, quantity } = req.body;

  try {
    const newPromotion = {
      name,
      promotion_percent,
      rank,
      start,
      end,
      quantity,
    };

    const response = await Promotion.findByIdAndUpdate(
      promotion_id,
      newPromotion,
    );

    if (!response)
      return res.status(404).json({
        success: false,
        message: 'Promotion not found !!!',
      });

    res.json({
      success: true,
      message: 'Update Promotion Successfully !!!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).message('Server Time Out !!!');
  }
});

// @route PUT api/promotion/update/cancel/:id
// @desc update Promotion status ended
// @access public
routes.put(
  '/update/cancel/:id',
  verifyToken.verifyEmployee,
  async (req, res) => {
    const promotion_id = req.params.id;

    try {
      const response = await Promotion.findByIdAndUpdate(promotion_id, {
        status: 'ENDED',
      });

      if (!response)
        return res
          .status(404)
          .json({ success: false, message: 'Promotion not found !!!' });

      res.json({
        success: true,
        message: 'Update Promotion Successfully !!!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).message('Server Time Out !!!');
    }
  },
);

// @route PUT api/promotion/
// @desc update Promotion status
// @access public
routes.put('/', async (req, res) => {
  try {
    const promotion = await Promotion.find({});

    await Promise.all(
      promotion.map(async (item) => {
        if (item.status.toString() !== 'ENDED')
          if (
            Date.parse(item.start) <= Date.now() &&
            Date.parse(item.end) >= Date.now()
          ) {
            await Promotion.updateOne({ _id: item._id }, { status: 'ACTIVE' });
          } else if (Date.parse(item.end) < Date.now()) {
            await Promotion.updateOne({ _id: item._id }, { status: 'ENDED' });
          } else {
            await Promotion.updateOne(
              { _id: item._id },
              { status: 'PROCESSING' },
            );
          }
      }),
    );

    res.json({
      success: true,
      message: 'Update Promotion Successfully !!!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).message('Server Time Out !!!');
  }
});

// @route GET api/promotion/
// @desc get all Promotions
// @access public
routes.get('/', async (req, res) => {
  try {
    const promotion = await Promotion.find({}).populate('rank');

    if (promotion.length < 0)
      return res
        .status(404)
        .json({ success: false, message: 'Promotiton is empty !!!' });

    res.json({ success: true, promotion });
  } catch (error) {
    console.log(error);
    res.status(500).message('Server Time Out !!!');
  }
});

// @route GET api/promotion/rank/:rank
// @desc get all Promotions by rank
// @access public
routes.get('/rank/:rank/:cid', async (req, res) => {
  const promotionRank = req.params.rank;
  const customerId = req.params.cid;

  let uniqueDiscount = [];
  let uniquePromotion = [];

  try {
    const bill = await Bill.find(
      { customer: customerId },
      { discount: 1, _id: 0 },
    );

    let promotionRanks = await Promotion.find({ status: 'ACTIVE' }).populate(
      'rank',
    );

    let promotion = promotionRanks.filter(
      (item) =>
        item.rank.rank.toString().includes(promotionRank.toString()) ||
        item.rank.rank.toString().includes('0'),
    );

    bill.map((item) => {
      var b = isUniqueDiscount(uniqueDiscount, item.discount);
      if (b) uniqueDiscount.push(item.discount);
    });

    promotion.map((item) => {
      var b = isUniqueDiscount(uniquePromotion, item._id);
      if (b) uniquePromotion.push(item._id);
    });

    uniqueDiscount.map((bill) => {
      const c = uniquePromotion.toString().includes(bill.toString());
      if (c) {
        promotion = promotion.filter(
          (promotion) => promotion._id.toString() !== bill.toString(),
        );
      }
    });

    if (promotionRanks.length <= 0)
      return res
        .status(404)
        .json({ success: false, message: 'Promotiton is empty !!!' });

    res.json({ success: true, promotion });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Time Out !!!' });
  }
});

// unique discount key
const isUniqueDiscount = (array, id) => {
  let check = false;

  if (array.length <= 0) {
    check = true;
    return check;
  }

  if (id !== null) {
    const c = array.toString().includes(id.toString());
    if (!c) {
      check = true;
      return check;
    }
  }

  return check;
};

module.exports = routes;
