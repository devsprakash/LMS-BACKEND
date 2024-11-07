const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const cookie = require('cookie-session');
const flash = require('connect-flash');
const indexRouter = require('./v1/routes/index');
const usersRouter = require('./v1/routes/users');
const indexAdminRouter = require('./admin/routes/index');
const adminRouter = require('./admin/routes/admin');
const crypto = require('crypto');
const fs = require('fs')

const app = express();
app.use(cors());
app.use(flash());


app.use(
  cookie({
    // Cookie config, take a look at the docs...
    secret: 'I Love India...',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true
    },
  }),
);


// Middleware to parse incoming requests
app.use(express.json());


app.post('/verification', (req, res) => {
  // Razorpay signature from headers
  const razorpaySignature = req.headers['x-razorpay-signature'];

  // Verify the signature using the raw body
  const body = req.body;
  console.log('Raw Body:', body);

  // Generate expected signature
  const expectedSignature = crypto
      .createHmac('sha256', 'ATIIT')
      .update(body)
      .digest('hex');

  // Compare the signatures
  if (razorpaySignature === expectedSignature) {
      console.log('Webhook signature verified');

      const event = req.body.event;
      const payload = req.body.payload;

      // Handle the different Razorpay events
      if (event === 'payment.success') {
          console.log('Payment successful:', payload.payment.entity);
          // Add your business logic here
      } else if (event === 'payment.failed') {
          console.log('Payment failed:', payload.payment.entity);
          // Add your business logic here
      } else if (event === 'order.created') {
          console.log('Order created:', payload.order.entity);
          // Add your business logic here
      } else {
          console.log('Unhandled event type:', event);
      }

      res.status(200).send('Webhook received successfully');
  } else {
      console.error('Webhook signature verification failed');
      res.status(400).send('Invalid signature');
  }
});


//Database connection with mongodb
const mongoose = require('./config/database');


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(uploadDir));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/', indexAdminRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("err..........", err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;