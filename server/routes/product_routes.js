const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const Product = require('../models/Product');
const Import = require('../models/Import');

// @route POST api/product/create
// @desc Create new Product
// @access private
routes.post('/create', verifyToken.verifyEmployee, async (req, res) => {
  const { name, describe, price, quantity, type, sub_type, brand, image } =
    req.body;

  if (!name || !describe || !price || !quantity || !type || !image)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const productExist = await Product.findOne({ name, type });

    if (productExist)
      return res
        .status(400)
        .json({ success: false, message: 'Product already exist !!!' });

    let newProduct = new Product({
      name,
      describe,
      price,
      quantity,
      type,
      brand,
      image,
    });

    if (sub_type !== null) {
      newProduct = new Product({
        name,
        describe,
        price,
        quantity,
        type,
        sub_type,
        brand,
        image,
      });
    }

    await newProduct.save();

    const newImport = new Import({
      product: newProduct._id,
      quantity: newProduct.quantity,
    });

    await newImport.save();

    res.json({
      success: true,
      message: 'Create Product Successfully !!!',
      newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT api/product/:id
// @desc Update Product with ObjectId
// @access private
routes.put('/:id', verifyToken.verifyEmployee, async (req, res) => {
  const product_code = req.params.id;
  const { name, describe, price, type, sub_type, brand, image } = req.body;

  if (!name || !describe || !price || !type || !brand || !image)
    return res
      .status(400)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    let updateProduct = {
      name,
      describe,
      price,
      type,
      brand,
      image,
    };

    if (sub_type !== null) {
      updateProduct = {
        name,
        describe,
        price,
        type,
        sub_type,
        brand,
        image,
      };
    }

    const product = await Product.findOneAndUpdate(
      { _id: product_code },
      updateProduct,
    );

    if (!product)
      return res.json({
        success: false,
        message: 'Update Product Unsuccessful !!!',
      });

    res.json({
      success: true,
      message: 'Update Product Successfully !!!',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT api/product/import
// @desc Update Product quantity with ObjectId
// @access private
routes.post('/import', verifyToken.verifyEmployee, async (req, res) => {
  const { importData } = req.body;

  if (!importData)
    return res
      .status(404)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    const promises = importData.map(async (item) => {
      const productExists = await Product.findById(item.product._id);

      if (productExists) {
        return Product.findByIdAndUpdate(productExists._id, {
          quantity: productExists.quantity + item.quantity,
        });
      }
    });

    const responses = await Promise.all(promises);

    if (responses.includes(null)) {
      return res.status(400).json({
        success: false,
        message: 'Update product quantity failed !!!',
      });
    }

    res.json({
      success: true,
      message: 'Update Product Successfully !!!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT api/product/view/:id
// @desc Update Product view with ObjectId
// @access private
routes.put('/view/:id', async (req, res) => {
  const product_code = req.params.id;

  try {
    const productView = await Product.findById(product_code, { view: 1 });

    const product = await Product.findOneAndUpdate(
      { _id: product_code },
      { view: (productView.view += 1) },
    );

    if (!product)
      return res.json({
        success: false,
        message: 'Update Product Unsuccessful !!!',
      });

    res.json({
      success: true,
      message: 'Update Product Successfully !!!',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route DELETE api/product/:id
// @desc Delete product with ObjectId
// @access private
routes.delete('/:id', verifyToken.verifyAdmin, async (req, res) => {
  const product_id = req.params.id;

  if (!product_id)
    return res
      .status(400)
      .json({ success: false, message: 'Product code invalid' });

  try {
    const product = await Product.findOneAndDelete({ _id: product_id });

    if (!product)
      return res
        .status(400)
        .json({ success: false, message: 'Delete Product Unsuccessful !!!' });

    res.json({
      success: true,
      message: 'Delete Product Successfully !!!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/product
// @desc Get all product
// @access public
routes.get('/', async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: 'type',
        select: 'name',
      })
      .populate({
        path: 'sub_type',
        select: 'name',
      })
      .populate({
        path: 'brand',
        select: 'name',
      });

    if (!products)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found !!!' });

    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/product/:id
// @desc Get product by product._id
// @access public
routes.get('/:id', async (req, res) => {
  const product_id = req.params.id;
  try {
    const product = await Product.findById(product_id)
      .populate({
        path: 'type',
        select: 'name',
      })
      .populate({
        path: 'brand',
        select: 'name',
      })
      .populate({
        path: 'sub_type',
        select: 'name',
      });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found !!!' });

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/product/type/:id
// @desc Get product by typeId
// @access public
routes.get('/type/:id', async (req, res) => {
  const type_id = req.params.id;

  try {
    const product = await Product.find({
      type: type_id,
    }).populate('type');

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found !!!' });

    if (product.length <= 0)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found !!!' });

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/product/ltype/:id
// @desc Get product by ltypeId
// @access public
routes.get('/ltype/:id', async (req, res) => {
  const ltype_id = req.params.id;

  try {
    const product = await Product.find({
      sub_type: ltype_id,
    }).populate('type');

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found !!!' });

    if (product.length <= 0)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found !!!' });

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route GET /api/product/brand/:id
// @desc Get product by brandId
// @access public
routes.get('/brand/:id', async (req, res) => {
  const brand_id = req.params.id;

  try {
    const product = await Product.find({
      brand: brand_id,
    }).populate('type');

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found !!!' });

    if (product.length <= 0)
      return res
        .status(404)
        .json({ success: false, message: 'Product not found !!!' });

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
