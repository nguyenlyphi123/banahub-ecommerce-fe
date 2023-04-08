const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const Type = require('../models/Type');

// @route POST api/type/create
// @desc Create new Type
// @access private
routes.post('/create', verifyToken.verifyAdmin, async (req, res) => {
  const { name, icon_link } = req.body;

  if (!name || !icon_link)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const typeExist = await Type.findOne({ name });

    if (typeExist)
      return res
        .status(400)
        .json({ success: false, message: 'Type already exists !!!' });

    const newType = new Type({
      name,
      icon_link,
    });

    await newType.save();

    res.json({
      success: true,
      message: 'Create Type Successfully !!!',
      newType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT api/type/:id
// @desc Update Type of Type
// @access private
routes.put('/:id', verifyToken.verifyAdmin, async (req, res) => {
  const type_code = req.params.id;
  const { name, icon_link } = req.body;

  if (!name || !icon_link)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const updateType = {
      name,
      icon_link,
    };

    const type = await Type.findOneAndUpdate({ _id: type_code }, updateType);

    if (!type)
      return res.json({
        success: false,
        message: 'Update Type Unsuccessful !!!',
      });

    res.json({ success: true, message: 'Update Type Successfully !!!', type });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route DELETE api/type/:id
// @desc Delete Type of Product
// @access private
routes.delete('/:id', verifyToken.verifyAdmin, async (req, res) => {
  const type_code = req.params.id;

  if (!type_code)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const type = await Type.findOneAndDelete({ _id: type_code });

    if (!type)
      return res.json({
        success: false,
        message: 'Delete Type Unsuccessful !!!',
      });

    res.json({ success: true, message: 'Delete Type Successfully !!!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/type
// @desc Get all Type
// @access public
routes.get('/', async (req, res) => {
  try {
    const types = await Type.find({});

    if (!types)
      return res
        .status(404)
        .json({ success: false, message: 'Type not found !!!' });

    res.json({ success: true, types });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/type
// @desc Get all type
// @access public
routes.get('/:id', async (req, res) => {
  const type_id = req.params.id;
  try {
    const type = await Type.findById(type_id);

    if (!type)
      return res
        .status(404)
        .json({ success: false, message: 'Type not found !!!' });

    res.json({ success: true, type });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
