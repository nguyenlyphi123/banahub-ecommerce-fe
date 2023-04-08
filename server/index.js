const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// customer router
const productRouter = require('./routes/product_routes');
const accountRouter = require('./routes/account_routes');
const typeRouter = require('./routes/type_routes');
const lower_typeRouter = require('./routes/lower_type_routes');
const brandRouter = require('./routes/brand_routes');
const billRouter = require('./routes/bill_routes');
const ratingRouter = require('./routes/rating_routes');
const promotionRouter = require('./routes/promotion_routes');
const customerRouter = require('./routes/customer_info_routes');
const customerRankRouter = require('./routes/customer_rank_routes');
// const billRouter = require('./routes/bill_routes');

// employee router
const positionRouter = require('./routes/position_routes');
const employeeRouter = require('./routes/employee_routes');
const wokingScheduleRouter = require('./routes/working_schedule_routes');
const invoiceRequirementRouter = require('./routes/invoice_requirement_routes');
const exportRouter = require('./routes/export_routes');
const warrantyCategoryRouter = require('./routes/warranty_category_routes');
const warrantyPursuitRouter = require('./routes/warranty_pursuit_routes');
const warrantyRouter = require('./routes/warranty_routes');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@banahubweb.g76sisf.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/product', productRouter);
app.use('/api/account', accountRouter);
app.use('/api/type', typeRouter);
app.use('/api/ltype', lower_typeRouter);
app.use('/api/brand', brandRouter);
app.use('/api/bill', billRouter);
app.use('/api/rating', ratingRouter);
app.use('/api/promotion', promotionRouter);

// customer
app.use('/api/customer', customerRouter);
app.use('/api/customer_rank', customerRankRouter);

// employee
app.use('/api/position', positionRouter);
app.use('/api/position', positionRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/working-schedule', wokingScheduleRouter);
app.use('/api/invoice-requirement', invoiceRequirementRouter);
app.use('/api/export', exportRouter);
app.use('/api/warranty-category', warrantyCategoryRouter);
app.use('/api/warranty-pursuit', warrantyPursuitRouter);
app.use('/api/warranty', warrantyRouter);

const PORT = 6001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
