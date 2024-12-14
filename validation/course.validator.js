
const { body, validationResult, query, param } = require('express-validator');



exports.add_course_validator = [

  body('course_name')
    .not()
    .isEmpty().withMessage('course_name is required')
    .isString().withMessage('course_name must be a string')
    .trim(),

  body('course_duration')
    .not()
    .isEmpty()
    .withMessage('course_duration is required')
    .isString().withMessage('course_duration mus be a string')
    .trim(),

  body('isPublished')
    .not()
    .isEmpty().withMessage('isPublished is required')
    .isBoolean().withMessage('isPublished must be a true or false')
    .trim(),
];

exports.courseId_validator = [

  query('courseId')
  .not()
  .isEmpty().withMessage('courseId is required')
  .isString().withMessage('courseId must be a string')
  .isMongoId().withMessage('please enter a valid course id')
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
