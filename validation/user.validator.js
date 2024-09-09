
const { body, validationResult } = require('express-validator');


const valid_gender = ['male', 'female', 'other'];

exports.user_validator = [

  body('full_name')
    .not()
    .isEmpty().withMessage('full_name is required')
    .isString().withMessage('full_name must be a string')
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

  body('gender')
    .not()
    .isEmpty().withMessage('gender is required')
    .isString().withMessage('gender must be a string')
    .isIn(valid_gender)
    .withMessage('please enter a valid gender type')
    .trim(),

  body('city')
    .not()
    .isEmpty().withMessage('city is required')
    .isString().withMessage('city must be a string')
    .trim(),

  body('course_name')
    .not()
    .isEmpty().withMessage('course_name is required')
    .isString().withMessage('course_name must be a string')
    .trim(),

];


exports.talk_to_expert_validator = [

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

];



exports.brochure_download_validator = [

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


exports.discount_form_validator = [

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

  body('city')
    .not()
    .isEmpty().withMessage('city is required')
    .isString().withMessage('city must be a string')
    .trim(),

  body('course_name')
    .not()
    .isEmpty().withMessage('course_name is required')
    .isString().withMessage('course_name must be a string')
    .trim(),

  body('adharacard')
    .not()
    .isEmpty().withMessage('adharacard is required')
    .isNumeric().withMessage('adharacard must be a number')
    .isLength({ min: 12, max: 12 })
    .withMessage('adharacard length should be 12')
    .trim(),

    body('pancard')
    .not()
    .isEmpty().withMessage('pancard is required')
    .isString().withMessage('pancard must be a string')
    .trim(),


];



exports.post_story_validation = [

  body('name')
  .not()
  .isEmpty().withMessage('name is required')
  .isString().withMessage('name must be a string')
  .trim(),

body('email')
  .not()
  .isEmpty().withMessage('email is required')
  .isString().withMessage('email must be a string')
  .isEmail().withMessage('please enter valid email')
  .trim(),

  body('descripation')
  .not()
  .isEmpty().withMessage('descripation is required')
  .isString().withMessage('descripation must be a string')
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



