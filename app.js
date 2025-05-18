require('dotenv').config({ path: `.env.dev` });
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./src/routes/index');
const locationRouter = require('./src/routes/locations');
const roleRouter = require('./src/routes/roles');
const productCategoryRouter = require('./src/routes/productCategory');
const productStockRouter = require('./src/routes/productStock');
const salesRouter = require('./src/routes/sales');
const purchaseRouter = require('./src/routes/purchases');
const usersRouter = require('./src/routes/users');
const productsRouter = require('./src/routes/products');

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/product_category', productCategoryRouter);
app.use('/products', productsRouter);
app.use('/locations', locationRouter);
app.use('/roles', roleRouter);
app.use('/users', usersRouter)
app.use('/sales', salesRouter);
app.use('/product_stocks', productStockRouter);
app.use('/purchases', purchaseRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.type('text/plain');
  res.status(404);
  res.json({message:"Sorry, that route doesn't exist."});
});

// error handler
app.use(function (err, req, res, next) {
  res.type('text/plain');
  res.status(500);
  res.json({message: '500 Internal server error'});
});

module.exports = app;
