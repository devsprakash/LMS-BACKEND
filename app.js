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
const UserAdminRouter = require('./admin/routes/user');
const coursesRouter = require("./admin/routes/courses");
const batchRouter = require('./admin/routes/batch');
const seatBookingRouter = require('./v1/routes/seat_booking')
const crypto = require('crypto');
const fs = require('fs');

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


app.post('/payment_verification', (req, res) => {
  const secret = '7290938999'; 
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
  }
  console.log('reqBody.........', body)

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
app.use('/admin/users', UserAdminRouter);
app.use('/admin/course' , coursesRouter);
app.use('/admin/batch' , batchRouter);
app.use('/user/book' , seatBookingRouter);


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