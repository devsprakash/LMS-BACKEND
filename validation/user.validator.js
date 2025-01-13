
const { body, validationResult , query } = require('express-validator');


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


]


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


exports.post_blog_validation = [

  body('blog_name')
    .not()
    .isEmpty().withMessage('blog_name is required')
    .isString().withMessage('blog_name must be a string')
    .trim(),

  body('blog_title')
    .not()
    .isEmpty().withMessage('blog_title is required')
    .isString().withMessage('blog_title must be a string')
    .trim(),

  body('blog_category')
    .not()
    .isEmpty().withMessage('blog_category is required')
    .isString().withMessage('blog_category must be a string')
    .trim(),

  body('blog_content')
    .not()
    .isEmpty().withMessage('blog_content is required')
    .isString().withMessage('blog_content must be a string')
    .trim(),

]


exports.booking_validator = [

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

  body('adharcard')
    .not()
    .isEmpty().withMessage('adharcard is required')
    .isNumeric().withMessage('adharcard must be a number')
    .isLength({ min: 12, max: 12 }).withMessage('adharcard must be at least 12 characters')
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



exports.hiring_validator = [

  body('name')
    .not()
    .isEmpty().withMessage('name is required')
    .isString().withMessage('name must be a string')
    .trim(),

  body('work_email')
    .not()
    .isEmpty()
    .withMessage('work_email is required')
    .isString().withMessage('work_email mus be a string')
    .isEmail().withMessage('please enter a valid work_email')
    .trim(),

  body('phone_number')
    .not()
    .isEmpty().withMessage('phone_number is required')
    .isString().withMessage('phone_number must be a string')
    .isMobilePhone().withMessage('please enter a valid phone number')
    .isLength({ min: 10, max: 12 }).withMessage('phone must be at least 10 characters')
    .trim(),

  body('company')
    .not()
    .isEmpty().withMessage('company is required')
    .isString().withMessage('company must be a string')
    .trim(),

  body('your_requirements')
    .not()
    .isEmpty().withMessage('your_requirements is required')
    .isString().withMessage('your_requirements must be a string')
    .trim(),

];


exports.contact_us_validator = [

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

  body('message')
    .not()
    .isEmpty().withMessage('message is required')
    .isString().withMessage('message must be a string')
    .trim(),

]

exports.blog_contact_us_validator = [

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
]


exports.refer_and_earn_validator = [

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
    .isEmpty()
    .withMessage('course_name is required')
    .isString().withMessage('course_name mus be a string')
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
]

exports.verify_email_validator = [

  body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isString().withMessage('email mus be a string')
    .isEmail().withMessage('please enter a valid email')
    .trim(),
]



exports.reset_password_validator = [

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


exports.call_back_validator = [

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
]



exports.apply_now_validator = [

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

    body('position')
    .not()
    .isEmpty().withMessage('position is required')
    .isString().withMessage('position must be a string')
    .trim(),

    body('experience')
    .not()
    .isEmpty().withMessage('experience is required')
    .isNumeric().withMessage('experience must be a number')
    .trim(),

    body('immediate_join')
    .not()
    .isEmpty().withMessage('immediate_join is required')
    .isString().withMessage('immediate_join must be a string')
    .trim(),
]


exports.otp_validator = [
    
     body('otp')
     .not()
     .isEmpty().withMessage('otp is required')
     .isNumeric().withMessage('otp must be a number')
     .isLength({ min:4 , max:4 }).withMessage('otp max length is 4')
     .trim(),

     body('userId')
     .notEmpty().withMessage('User ID is required')
     .isString().withMessage('User ID must be a string')
     .isLength({ min: 24, max: 24 }).withMessage('User ID length should be 24 characters')
     .isMongoId().withMessage('Please enter a valid User ID')
     .trim(),
   
]


exports.resend_otp_validator = [
    
  body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isString().withMessage('email mus be a string')
    .isEmail().withMessage('please enter a valid email')
    .trim(),

  body('userId')
  .notEmpty().withMessage('User ID is required')
  .isString().withMessage('User ID must be a string')
  .isLength({ min: 24, max: 24 }).withMessage('User ID length should be 24 characters')
  .isMongoId().withMessage('Please enter a valid User ID')
  .trim(),

]



exports.application_deatils_validator = [

  body('name')
    .not()
    .isEmpty().withMessage('name is required')
    .isString().withMessage('name must be a string')
    .trim(),

  body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isString().withMessage('email must be a string')
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
    .trim(),

  body('date_of_birth')
    .not()
    .isEmpty().withMessage('date_of_birth is required')
    .isString().withMessage('date_of_birth must be a string')
    .trim(),

  body('state')
    .not()
    .isEmpty().withMessage('state is required')
    .isString().withMessage('state must be a string')
    .trim(),

  body('location')
    .not()
    .isEmpty().withMessage('location is required')
    .isString().withMessage('location must be a string')
    .trim(),

  body('city')
    .not()
    .isEmpty().withMessage('city is required')
    .isString().withMessage('city must be a string')
    .trim(),

  body('highest_qualification')
    .not()
    .isEmpty().withMessage('highest_qualification is required')
    .isString().withMessage('highest_qualification must be a string')
    .trim(),

  body('specialization')
    .not()
    .isEmpty().withMessage('specialization is required')
    .isString().withMessage('specialization must be a string')
    .trim(),

  body('institute_name')
    .not()
    .isEmpty().withMessage('institute_name is required')
    .isString().withMessage('institute_name must be a string')
    .trim(),

  body('passing_year')
    .not()
    .isEmpty().withMessage('passing_year is required')
    .isString().withMessage('passing_year must be a string')
    .trim(),

  body('working_professional')
    .not()
    .isEmpty().withMessage('working_professional is required')
    .isString().withMessage('working_professional must be a string')
    .trim(),
];



exports.application_fees_validator = [

  body('amount')
    .not()
    .isEmpty()
    .withMessage('amount is required')
    .isNumeric().withMessage('amount mus be a string')
    .trim(),

    body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isString().withMessage('email mus be a string')
    .isEmail().withMessage('please enter a valid email')
    .trim(),
];


exports.order_summary_validator = [

  body('total_amount')
  .not()
  .isEmpty()
  .withMessage('amount is required')
  .isNumeric().withMessage('amount mus be a string')
  .trim(),

];


exports.application_fees_details_validator = [

  body('course_name')
  .not()
  .isEmpty().withMessage('course_name is required')
  .isString().withMessage('course_name must be a string')
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



