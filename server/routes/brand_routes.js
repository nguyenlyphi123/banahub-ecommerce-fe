const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const Brand = require('../models/Brand');

// @route POST api/brand/create
// @desc Create new Brand
// @access private
routes.post('/create', verifyToken.verifyAdmin, async (req, res) => {
  const { name, type, sub_type } = req.body;

  if (!name || !type)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    let brandExist = await Brand.findOne({ name, type });

    if (sub_type !== null)
      brandExist = await Brand.findOne({ name, type, sub_type });

    if (brandExist)
      return res
        .status(400)
        .json({ success: false, message: 'Brand already exists !!!' });

    const newBrand = new Brand({
      name,
      type,
      sub_type: sub_type,
    });

    await newBrand.save();

    res.json({
      success: true,
      message: 'Create Brand Successfully !!!',
      newBrand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT api/brand/update
// @desc Update Brand
// @access private
routes.put('/update/:id', verifyToken.verifyAdmin, async (req, res) => {
  const brand_code = req.params.id;
  const { name, type, sub_type } = req.body;

  if (!name || !type)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    let updateBrand = {
      name,
      type,
    };

    if (sub_type !== null) updateBrand = { name, type, sub_type };

    const brand = await Brand.findOneAndUpdate(
      { _id: brand_code },
      updateBrand,
    );

    if (!brand)
      return res.json({
        success: false,
        message: 'Update Brand Unsuccessful !!!',
      });

    res.json({
      success: true,
      message: 'Update Brand Successfully !!!',
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route DELETE api/brand/:id
// @desc Delete Brand of Product
// @access private
routes.delete('/:id', verifyToken.verifyAdmin, async (req, res) => {
  const brand_code = req.params.id;

  if (!brand_code)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const brand = await Brand.findOneAndDelete({ _id: brand_code });

    if (!brand)
      return res.json({
        success: false,
        message: 'Delete Brand Unsuccessful !!!',
      });

    res.json({ success: true, message: 'Delete Brand Successfully !!!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/brand
// @desc Get all Brand
// @access public
routes.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({});

    if (!brands)
      return res
        .status(404)
        .json({ success: false, message: 'Brand not found !!!' });

    res.json({ success: true, brands });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/brand/:id
// @desc Get brand by brand_id
// @access public
routes.get('/:id', async (req, res) => {
  const brand_id = req.params.id;
  try {
    const brand = await Brand.findById(brand_id);

    if (!brand)
      return res
        .status(404)
        .json({ success: false, message: 'Brand not found !!!' });

    res.json({ success: true, brand });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/brand/type/:id
// @desc Get brand by type_id and ltype_id
// @access public
routes.get('/type/:id', async (req, res) => {
  const type_id = req.params.id;

  if (!type_id)
    return res
      .status(404)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    let brand = await Brand.find({ type: type_id });

    if (brand.length === 0)
      return res
        .status(404)
        .json({ success: false, message: 'Brand not found !!!' });

    if (!brand)
      return res
        .status(404)
        .json({ success: false, message: 'Brand not found !!!' });

    res.json({ success: true, brand });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/brand/ltype/:_id
// @desc Get brand by ltype_id
// @access public
routes.get('/ltype/:id', async (req, res) => {
  const sub_type_id = req.params.id;

  if (!sub_type_id)
    return res
      .status(404)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    let brand = await Brand.find({ sub_type: sub_type_id });

    if (!brand)
      return res
        .status(404)
        .json({ success: false, message: 'Brand not found !!!' });

    res.json({ success: true, brand });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
