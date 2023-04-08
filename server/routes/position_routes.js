const express = require('express');
const routes = express.Router();

const verifyToken = require('../middleware/auth');

const Position = require('../models/Position');

// @route POST api/position/create
// @desc create new Position
// @access private
routes.post('/create', verifyToken.verifyAdmin, async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res
      .status(404)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const newPosition = new Position({ name });

    await newPosition.save();

    res.json({
      success: true,
      message: 'Create Position Successfully !!!',
      newPosition,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET api/position
// @desc get all Position
// @access private
routes.get('/', async (req, res) => {
  try {
    const positions = await Position.find({});

    if (!positions)
      return res
        .status(404)
        .json({ success: false, message: 'Position is null !!!' });

    res.json({
      success: true,
      positions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
