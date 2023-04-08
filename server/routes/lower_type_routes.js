const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const LowerType = require('../models/Lower_Type');

// @route POST api/ltype/create
// @desc Create new LowerType
// @access private
routes.post('/create', verifyToken.verifyAdmin, async (req, res) => {
  const { name, h_type_id } = req.body;

  if (!name || !h_type_id)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const typeExist = await LowerType.findOne({ name, h_type_id });

    if (typeExist)
      return res
        .status(400)
        .json({ success: false, message: 'LowerType already exists !!!' });

    const newLType = new LowerType({
      h_type_id,
      name,
    });

    await newLType.save();

    res.json({
      success: true,
      message: 'Create LowerType Successfully !!!',
      newLType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT api/ltype/:id
// @desc Update LowerType of LowerType
// @access private
routes.put('/:id', verifyToken.verifyAdmin, async (req, res) => {
  const type_code = req.params.id;
  const { name } = req.body;

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const updateLType = {
      name,
    };

    const type = await LowerType.findOneAndUpdate(
      { _id: type_code },
      updateLType,
    );

    if (!type)
      return res.json({
        success: false,
        message: 'Update LowerType Unsuccessful !!!',
      });

    res.json({
      success: true,
      message: 'Update LowerType Successfully !!!',
      type,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route DELETE api/ltype/:id
// @desc Delete LowerType of Product
// @access private
routes.delete('/:id', verifyToken.verifyAdmin, async (req, res) => {
  const type_code = req.params.id;

  if (!type_code)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const type = await LowerType.findOneAndDelete({ _id: type_code });

    if (!type)
      return res.json({
        success: false,
        message: 'Delete LowerType Unsuccessful !!!',
      });

    res.json({ success: true, message: 'Delete LowerType Successfully !!!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/ltype
// @desc Get all LowerType
// @access public
routes.get('/', async (req, res) => {
  try {
    const ltypes = await LowerType.find({}).populate({
      path: 'h_type_id',
      select: '_id',
    });

    if (!ltypes)
      return res
        .status(404)
        .json({ success: false, message: 'LowerType not found !!!' });

    res.json({ success: true, ltypes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/ltype/h/:id
// @desc Get all type follow by h_type_id
// @access public
routes.get('/h/:id', async (req, res) => {
  const h_type_id = req.params.id;
  try {
    const ltype = await LowerType.find({ h_type_id }).populate('h_type_id');

    if (ltype.length === 0)
      return res
        .status(404)
        .json({ success: false, message: 'LowerType not found !!!' });

    if (!ltype)
      return res
        .status(404)
        .json({ success: false, message: 'LowerType not found !!!' });

    res.json({ success: true, ltype });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/ltype/:id
// @desc Get type by ObjectId
// @access public
routes.get('/:id', async (req, res) => {
  const type_id = req.params.id;
  try {
    const type = await LowerType.findById(type_id).populate('h_type_id');

    if (!type)
      return res
        .status(404)
        .json({ success: false, message: 'LowerType not found !!!' });

    res.json({ success: true, ltype });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
