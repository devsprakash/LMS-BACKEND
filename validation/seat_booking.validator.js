
const { body, validationResult} = require('express-validator');


exports.seat_booking_validator = [

  body('name')
    .not()
    .isEmpty().withMessage('name is required')
    .isString().withMessage('name must be a string')
    .trim(),

  body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isString().withMessage('email mus be a string')
    .isEmail().withMessage('please enter a valid email')
    .trim(),

  body('phone')
    .not()
    .isEmpty().withMessage('phone is required')
    .isString().withMessage('phone must be a string')
    .isMobilePhone().withMessage('please enter a valid phone number')
    .isLength({ min: 10, max: 12 }).withMessage('phone must be at least 10 characters')
    .trim(),

    body('course_name')
    .not()
    .isEmpty().withMessage('course_name is required')
    .isString().withMessage('course_name must be a string')
    .trim(),

    body('amount')
    .not()
    .isEmpty().withMessage('amount is required')
    .isNumeric().withMessage('amount must be a number')
    .trim(),

    body('payment_status')
    .not()
    .isEmpty().withMessage('payment_status is required')
    .isString().withMessage('payment_status must be a String')
    .trim(),

];




exports.ValidatorResult = (req, res, next) => {

  try {

    const result = validationResult(req);
    const haserror = !result.isEmpty();

    if (haserror) {
      const err = result.array()[0].msg;
      return res.status(400).send({ sucess: false, message: err });
    }
    next();

  } catch (err) {
    res.status(400).send({ status: false, message: err.message })
  }
}

