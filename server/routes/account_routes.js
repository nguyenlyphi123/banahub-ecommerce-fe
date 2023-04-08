const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

require('dotenv').config();

const Account = require('../models/Account');
const CustomerInfo = require('../models/CustomerInfo');
const Position = require('../models/Position');
const Employee = require('../models/Employee');

// UserAccount
// @route GET api/account/customer
// @desc Check if customer logged in
// @access public
router.get('/customer', verifyToken.verifyUser, async (req, res) => {
  try {
    const customer = await Account.findById(req.id).select('-password');

    if (!customer)
      return res
        .status(400)
        .json({ success: false, message: 'Customer not found' });

    const customerInfo = await CustomerInfo.findOne({
      customer_id: customer._id,
    });

    if (!customerInfo)
      return res
        .status(400)
        .json({ success: false, message: 'Customer not found' });

    const customerData = {
      _id: customer._id,
      email: customer.username,
      level: customer.level,
      info: customerInfo,
    };

    return res.json({ success: true, customerData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/account/register
// @desc Register Account
// @access private
router.post('/register', async (req, res) => {
  const { name, username, password, level } = req.body;

  if (!name || !username || !password)
    return res.status(400).json({
      success: false,
      message: 'Missing Username or Password',
    });

  try {
    const user = await Account.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'Username have already exist' });

    if (password.length <= 6)
      return res.status(400).json({
        success: false,
        message: 'Password must have more than 6 characters',
      });

    passwordHashed = await argon2.hash(password);

    let newAccount = new Account({
      username: username,
      password: passwordHashed,
      level,
    });

    // const process = await newAccount.save();

    if (await newAccount.save()) {
      if (newAccount.level === 0) {
        const newCustomer = new CustomerInfo({
          customer_id: newAccount._id,
          name,
        });

        await newCustomer.save();
      }
    }

    const accessToken = jwt.sign(
      {
        id: newAccount._id,
        level: newAccount.level,
      },
      process.env.ACCESS_TOKEN_SECRET,
    );

    res.json({
      success: true,
      message: 'Create Account successfully',
      newAccount,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/account/login
// @desc User Login
// @access public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Missing Username or Password' });

  try {
    const account = await Account.findOne({ username });
    if (!account)
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password' });

    console.log(account);

    const passwordValid = await argon2.verify(account.password, password);

    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password' });
    }

    const customerInfo = await CustomerInfo.findOne({
      customer_id: account._id,
    });

    if (!customerInfo)
      return res
        .status(400)
        .json({ success: false, message: 'Customer not found' });

    const customerData = {
      _id: account._id,
      email: account.username,
      level: account.level,
      info: customerInfo,
    };

    const accessToken = jwt.sign(
      {
        id: account._id,
        level: account.level,
      },
      process.env.ACCESS_TOKEN_SECRET,
    );

    res.json({ success: true, accessToken, customerData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/account/admin/login
// @desc Admin Login
// @access public
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Missing Username or Password' });

  try {
    const account = await Account.findOne({ username });
    if (!account)
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password' });

    const passwordValid = await argon2.verify(account.password, password);

    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password' });
    }

    const accessToken = jwt.sign(
      {
        id: account._id,
        level: account.level,
      },
      process.env.ACCESS_TOKEN_SECRET,
    );

    res.json({ success: true, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Enployee account
// @route GET api/account/customer
// @desc Check if customer logged in
// @access public
router.get('/employee', verifyToken.verifyEmployee, async (req, res) => {
  try {
    const employee = await Account.findById(req.id).select('-password');

    if (!employee)
      return res
        .status(400)
        .json({ success: false, message: 'Customer not found' });

    const employeeInfo = await Employee.findOne({
      employee_id: employee._id,
    });

    if (!employeeInfo)
      return res
        .status(400)
        .json({ success: false, message: 'Customer not found' });

    const employeeData = {
      _id: employee._id,
      email: employee.username,
      level: employee.level,
      info: employeeInfo,
    };

    return res.json({ success: true, employeeData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/account/employee/register
// @desc Register Account
// @access private
router.post('/employee/register', async (req, res) => {
  const { name, username, password, level, position } = req.body;

  if (!name || !username || !password || !level || !position)
    return res.status(400).json({
      success: false,
      message: 'Missing Username or Password',
    });

  try {
    const user = await Account.findOne({ username });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'Username have already exist' });

    if (password.length <= 6)
      return res.status(400).json({
        success: false,
        message: 'Password must have more than 6 characters',
      });

    passwordHashed = await argon2.hash(password);

    let newAccount = new Account({
      username: username,
      password: passwordHashed,
      level,
    });

    const saveProcess = await newAccount.save();

    if (saveProcess) {
      if (newAccount.level === 1) {
        const newEmployee = new Employee({
          employee_id: newAccount._id,
          name,
          position,
        });

        await newEmployee.save().then((response) => {
          const accessToken = jwt.sign(
            {
              id: newAccount._id,
              level: newAccount.level,
              position: response.position,
            },
            process.env.ACCESS_TOKEN_SECRET,
          );

          res.json({
            success: true,
            message: 'Create Account successfully',
            newAccount,
            response,
            accessToken,
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/account/employee/login
// @desc Employee Login
// @access public
router.post('/employee/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Missing Username or Password' });

  try {
    const account = await Account.findOne({ username });
    if (!account)
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password' });

    const passwordValid = await argon2.verify(account.password, password);

    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect username or password' });
    }

    const employee = await Employee.findOne({ employee_id: account._id });

    if (!employee)
      return res
        .status(400)
        .json({ success: false, message: 'Employee invalid !!!' });

    const employeeData = {
      _id: account._id,
      email: account.username,
      level: account.level,
      info: employee,
    };

    const accessToken = jwt.sign(
      {
        id: account._id,
        level: account.level,
        position: employee.position,
      },
      process.env.ACCESS_TOKEN_SECRET,
    );

    res.json({ success: true, accessToken, employeeData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
