const express = require('express');
const routes = express.Router();

const Rating = require('../models/Rating');

// @route POST api/rating/create
// @desc Create new Rating
// @access private
routes.post('/create', async (req, res) => {
  const { author, content, rating, product_id } = req.body.commentData;

  console.log(req.body.commentData);

  if (!author || !rating || !product_id)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const newRatig = new Rating({
      author,
      content,
      rating,
      product_id,
    });

    await newRatig.save();

    res.json({
      success: true,
      message: 'Create Rating Successfully !!!',
      newRatig,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/rating
// @desc Get all Rating
// @access public
routes.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find({});

    if (!ratings)
      return res
        .status(404)
        .json({ success: false, message: 'Rating not found !!!' });

    res.json({ success: true, ratings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/rating/:id
// @desc Get all rating by productId
// @access public
routes.get('/:id', async (req, res) => {
  const product_id = req.params.id;
  try {
    const ratings = await Rating.find({ product_id });

    if (!ratings)
      return res
        .status(404)
        .json({ success: false, message: 'Rating not found !!!' });

    res.json({ success: true, ratings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
