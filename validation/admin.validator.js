

const { body, validationResult , query } = require('express-validator');



exports.admin_validator = [

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

  body('password')
    .not()
    .isEmpty()
    .withMessage('password is required')
    .isString().withMessage('password mus be a string')
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters ')
    .trim(),

  body('phone')
    .not()
    .isEmpty().withMessage('phone is required')
    .isString().withMessage('phone must be a string')
    .isMobilePhone().withMessage('please enter a valid phone number')
    .isLength({ min: 10, max: 12 }).withMessage('phone must be at least 10 characters')
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
  
  
exports.reset_password_validator = [
  
    body('new_password')
      .not()
      .isEmpty()
      .withMessage('new_password is required')
      .isString().withMessage('new_password mus be a string')
      .isLength({ min: 8 }).withMessage('new_password must be at least 8 characters ')
      .trim(),
  
    body('confirm_password')
      .not()
      .isEmpty()
      .withMessage('confirm_password is required')
      .isString().withMessage('confirm_password mus be a string')
      .isLength({ min: 8 }).withMessage('confirm_password must be at least 8 characters ')
      .trim(),
  ]
  

  exports.forgot_password_validator = [

    body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isString().withMessage('email mus be a string')
    .isEmail().withMessage('please enter a valid email')
    .trim(),
  
    body('new_password')
      .not()
      .isEmpty()
      .withMessage('new_password is required')
      .isString().withMessage('new_password mus be a string')
      .isLength({ min: 8 }).withMessage('new_password must be at least 8 characters ')
      .trim(),
  
    body('confirm_password')
      .not()
      .isEmpty()
      .withMessage('confirm_password is required')
      .isString().withMessage('confirm_password mus be a string')
      .isLength({ min: 8 }).withMessage('confirm_password must be at least 8 characters ')
      .trim(),
  ]


  exports.chnage_role_validator = [

    body('userType')
    .not()
    .isEmpty()
    .withMessage('userType is required')
    .isNumeric().withMessage('userType mus be a number')
    .trim(),
  ]



  exports.update_admin_details_validator = [

    query('adminId')
    .not()
    .isEmpty().withMessage('adminId is required')
    .isString().withMessage('adminId must be a string')
    .isMongoId().withMessage('please enter a valid adminId')
    .trim(),

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
  ];


  exports.delete_admin_validator = [

    query('adminId')
    .not()
    .isEmpty().withMessage('adminId is required')
    .isString().withMessage('adminId must be a string')
    .isMongoId().withMessage('please enter a valid adminId')
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
  
  
    