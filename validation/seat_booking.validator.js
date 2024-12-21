
const { body, validationResult , query} = require('express-validator');


exports.seat_booking_validator = [

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
];


exports.delete_booking_validator = [

  query('bookingId')
  .not()
  .isEmpty().withMessage('bookingId is required')
  .isString().withMessage('bookingId must be a string')
  .isMongoId().withMessage('please enter a valid bookingId')
  .trim(),
]

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

