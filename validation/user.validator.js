
const { body, validationResult } = require('express-validator');



exports.user_validator = [

  body('first_name')
    .not()
    .isEmpty().withMessage('first_name is required')
    .isString().withMessage('first_name must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('first_name size must be between 2 and 30 characters')
    .trim(),

  body('last_name')
    .not()
    .isEmpty().withMessage('last_name is required')
    .isString().withMessage('last_name must be a string')
    .isLength({ min: 2, max: 20 })
    .withMessage('last_name size must be between 2 and 30 characters')
    .trim(),

  body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isString().withMessage('email mus be a string')
    .isEmail().withMessage('please enter a valid email')
    .trim(),

  body('password')
    .not()
    .isEmpty()
    .withMessage('password is required')
    .isString().withMessage('password mus be a string')
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters ')
    .trim(),

  body('confirm_password')
    .not()
    .isEmpty()
    .withMessage('confirm_password is required')
    .isString().withMessage('confirm_password mus be a string')
    .isLength({ min: 8 }).withMessage('confirm_password must be at least 8 characters ')
    .trim(),


  body('joining_date')
    .not()
    .isEmpty().withMessage('joining_date is required')
    .isString().withMessage('joining_date must be a string')
    .trim(),

  body('phone')
    .not()
    .isEmpty().withMessage('phone is required')
    .isString().withMessage('phone must be a string')
    .isMobilePhone().withMessage('please enter a valid phone number')
    .isLength({ max: 10 }).withMessage('phone must be at least 10 characters')
    .trim(),

  body('company')
    .not()
    .isEmpty().withMessage('company is required')
    .isString().withMessage('company must be a string')
    .trim(),


  body('department')
    .not()
    .isEmpty().withMessage('department is required')
    .isString().withMessage('department must be a string')
    .trim(),

  body('designation')
    .not()
    .isEmpty().withMessage('designation is required')
    .isString().withMessage('designation must be a string')
    .trim(),

  body('employee_id')
    .not()
    .isEmpty().withMessage('employee_id is required')
    .isString().withMessage('employee_id must be a string')
    .trim(),

];



exports.login_validator = [

  body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isString().withMessage('email mus be a string')
    .isEmail().withMessage('please enter a valid email')
    .trim(),

  body('password')
    .not()
    .isEmpty()
    .withMessage('password is required')
    .isString().withMessage('password mus be a string')
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters ')
    .trim(),
];

exports.generate_new_auth_token_validator = [

  body('refresh_token')
    .not()
    .isEmpty()
    .withMessage('refresh_token is required')
    .isString().withMessage('refresh_token mus be a string')
    .trim(),

]

exports.changePassword_validator = [
  body('old_password')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.old_password_required')
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('USER_VALIDATION.old_password_validation'),
  // .isLength({ min: 6 })
  // .withMessage('USER_VALIDATION.old_password_size'),
  body('new_password')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.new_password_required')
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('USER_VALIDATION.new_password_validation'),
  // .isLength({ min: 6 })
  // .withMessage('USER_VALIDATION.new_password_size'),
  body('confirm_password')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.confirm_password_required')
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('USER_VALIDATION.confirm_password_validation'),
  // .isLength({ min: 6 })
  // .withMessage('USER_VALIDATION.confirm_password_size'),
];

exports.restPassword_validator = [
  body('new_password')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.new_password_required')
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('USER_VALIDATION.new_password_validation'),
  // .isLength({ min: 6 })
  // .withMessage('USER_VALIDATION.new_password_size'),
  body('confirm_password')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.confirm_password_required')
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('USER_VALIDATION.confirm_password_validation'),
  // .isLength({ min: 6 })
  // .withMessage('USER_VALIDATION.confirm_password_size'),
];

exports.forgotPassword_validator = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.email_required')
    .isEmail().withMessage('USER_VALIDATION.valid_email')
    .trim()
];

exports.notification_validator = [
  body('daily_practice_remender')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.daily_practice_remender_required')
    .trim(),
  body('new_program_added')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.new_program_added_required')
    .trim(),
  body('subscription_remainder')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.subscription_remainder_required')
    .trim()
];


exports.socialLogin_validator = [
  body('social_id')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.social_id_required')
    .trim(),
  body('social_type')
    .not()
    .isEmpty()
    .withMessage('USER_VALIDATION.social_type_required')
    .trim()
    .matches(/^[1-3]$/)
    .withMessage('USER_VALIDATION.social_type_value'),
];


exports.update_validator1 = [
  // body('social_id')
  // .not()
  // .isEmpty()
  // .withMessage('USER_VALIDATION.social_id_required')
  // .trim(),
  // body('social_type')
  // .not()
  // .isEmpty()
  // .withMessage('USER_VALIDATION.social_type_required')
  // .trim()
  // .matches(/^[1-3]$/)
  // .withMessage('USER_VALIDATION.social_type_value'),
];


exports.update_validator = async (req, res, next) => {

  let screen = req.body.screen
  console.log("screen......", screen)


  module.exports = [
    body('daily_practice_remender')
      .not()
      .isEmpty()
      .withMessage('USER_VALIDATION.daily_practice_remender_required')
      .trim(),
    body('new_program_added')
      .not()
      .isEmpty()
      .withMessage('USER_VALIDATION.new_program_added_required')
      .trim(),
    body('subscription_remainder')
      .not()
      .isEmpty()
      .withMessage('USER_VALIDATION.subscription_remainder_required')
      .trim()
  ];

}

exports.verify_android_purchase_token_validator = [
  body('package_name')
    .not()
    .isEmpty()
    .withMessage('VERIFY_TOKEN_VALIDATION.package_name_required')
    .trim(),
  body('product_id')
    .not()
    .isEmpty()
    .withMessage('VERIFY_TOKEN_VALIDATION.product_id_required')
    .trim(),
  body('purchase_token')
    .not()
    .isEmpty()
    .withMessage('VERIFY_TOKEN_VALIDATION.purchase_token_required')
    .trim()
];

exports.verify_ios_purchase_token_validator = [
  body('apple_receipt')
    .not()
    .isEmpty()
    .withMessage('VERIFY_TOKEN_VALIDATION.apple_receipt_required')
    .trim(),
  body('transaction_id')
    .not()
    .isEmpty()
    .withMessage('VERIFY_TOKEN_VALIDATION.transaction_id_required')
    .trim()
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



