const express = require('express');
const routes = express.Router();
const verifyToken = require('../middleware/auth');

const InvoiceRequirement = require('../models/InvoiceRequirement');
const Bill = require('../models/Bill');
const Export = require('../models/Export');

const {
  EXPORTING,
  PREPARING,
  INSTALLING,
  INSTALLED,
  COMPLETE,
  DELIVERING,
} = require('../constants/constants');

// @route POST /api/invoice-requirement/create
// @desc create new invoice-requirement
// @access private
routes.post('/create', verifyToken.verifyEmployee, async (req, res) => {
  const { bill_id, responsible_staff, engineering_staff, export_staff } =
    req.body;

  if (!bill_id || !responsible_staff)
    return res
      .status(404)
      .json({ success: false, message: 'Missing data !!!' });

  try {
    let newInvoiceReq;
    if (!engineering_staff && !export_staff) {
      newInvoiceReq = new InvoiceRequirement({
        bill_id,
        responsible_staff,
        engineering_staff: null,
        export_staff: null,
      });
    } else if (!engineering_staff) {
      newInvoiceReq = new InvoiceRequirement({
        bill_id,
        responsible_staff,
        engineering_staff: null,
        export_staff,
      });
    } else if (!export_staff) {
      newInvoiceReq = new InvoiceRequirement({
        bill_id,
        responsible_staff,
        engineering_staff,
        export_staff: null,
      });
    } else
      newInvoiceReq = new InvoiceRequirement({
        bill_id,
        responsible_staff,
        engineering_staff,
        export_staff,
      });

    const response = await newInvoiceReq.save();

    if (!response)
      return res.status(400).json({
        success: false,
        message: 'Create InvoiceRequirement Unsuccessfully !!!',
      });

    const updateBill = await Bill.findOneAndUpdate(
      { _id: bill_id },
      { status: PREPARING },
    );

    if (!updateBill)
      return res.status(400).json({
        success: false,
        message: 'Update Bill status Unsuccessfully !!!',
      });

    res.json({
      success: true,
      message: 'Create InvoiceRequirement Successfully !!!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

// @route PUT /api/invoice-requirement/update/:id/export
// @desc update export_staff of invoice-requirement
// @access private
routes.put(
  '/update/:id/export',
  verifyToken.verifyEmployee,
  async (req, res) => {
    const invoices_id = req.params.id;
    const { export_staff } = req.body;

    if (!export_staff)
      return res
        .status(404)
        .json({ success: false, message: 'Missing data !!!' });

    try {
      const response = await InvoiceRequirement.findByIdAndUpdate(invoices_id, {
        export_staff: export_staff,
        status: EXPORTING,
      });

      if (!response)
        return res.status(400).json({
          success: false,
          message: 'Update InvoiceRequirement Unsuccessfully !!!',
        });

      const bill = await Bill.findById(response.bill_id);

      if (bill) {
        const exportPromises = bill.cart_list.map((cart) => {
          const newExport = new Export({
            bill: bill._id,
            product: cart.product,
            quantity: cart.quantity,
          });
          return newExport.save();
        });
        await Promise.all(exportPromises);
      }

      res.json({
        success: true,
        message: 'Update InvoiceRequirement Successfully !!!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server time out !!!' });
    }
  },
);

// @route PUT /api/invoice-requirement/update/:id/engineer
// @desc update engineering_staff of invoice-requirement
// @access private
routes.put(
  '/update/:id/engineer',
  verifyToken.verifyEmployee,
  async (req, res) => {
    const invoices_id = req.params.id;
    const { engineering_staff } = req.body;

    if (!engineering_staff)
      return res
        .status(404)
        .json({ success: false, message: 'Missing data !!!' });

    try {
      const response = await InvoiceRequirement.findByIdAndUpdate(invoices_id, {
        engineering_staff: engineering_staff,
        status: INSTALLING,
      });

      if (!response)
        return res.status(400).json({
          success: false,
          message: 'Update InvoiceRequirement Unsuccessfully !!!',
        });

      res.json({
        success: true,
        message: 'Update InvoiceRequirement Successfully !!!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server time out !!!' });
    }
  },
);

// @route PUT /api/invoice-requirement/update/:id/installed
// @desc update status: Installed of invoice-requirement
// @access private
routes.put(
  '/update/:id/installed',
  verifyToken.verifyEmployee,
  async (req, res) => {
    const invoices_id = req.params.id;

    try {
      const response = await InvoiceRequirement.findByIdAndUpdate(invoices_id, {
        status: INSTALLED,
      });

      if (!response)
        return res.status(400).json({
          success: false,
          message: 'Update InvoiceRequirement Status Unsuccessfully !!!',
        });

      res.json({
        success: true,
        message: 'Update InvoiceRequirement Status Successfully !!!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server time out !!!' });
    }
  },
);

// @route PUT /api/invoice-requirement/update/:id/complete
// @desc update status: Installed of invoice-requirement
// @access private
routes.put(
  '/update/:id/complete',
  verifyToken.verifyEmployee,
  async (req, res) => {
    const invoices_id = req.params.id;

    try {
      const response = await InvoiceRequirement.findByIdAndUpdate(invoices_id, {
        status: COMPLETE,
      });

      if (!response)
        return res.status(400).json({
          success: false,
          message: 'Update InvoiceRequirement Status Unsuccessfully !!!',
        });

      const bill_response = await Bill.findByIdAndUpdate(response.bill_id, {
        status: DELIVERING,
      });

      if (!bill_response)
        return res.status(400).json({
          success: false,
          message: 'Update Bill Status Unsuccessfully !!!',
        });

      res.json({
        success: true,
        message: 'Update InvoiceRequirement Status Successfully !!!',
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server time out !!!' });
    }
  },
);

// @route GET /api/invoice-requirement/
// @desc get all invoice-requirement
// @access private
routes.get('/', async (req, res) => {
  try {
    const invoices = await InvoiceRequirement.find({})
      .populate('responsible_staff')
      .populate('engineering_staff')
      .populate('export_staff');

    if (!invoices)
      return res
        .status(404)
        .json({ success: false, message: 'Invoice-requirement are empty !!!' });

    res.json({
      success: true,
      invoices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server time out !!!' });
  }
});

module.exports = routes;
