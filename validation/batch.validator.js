

const { body, validationResult, query, param } = require('express-validator');


exports.batch_validator = [

  body('batch_name')
    .not()
    .isEmpty().withMessage('name is required')
    .isString().withMessage('name must be a string')
    .trim(),

  body('course_name')
    .not()
    .isEmpty()
    .withMessage('course_name is required')
    .isString().withMessage('course_name mus be a string')
    .trim(),

  body('start_date')
    .not()
    .isEmpty()
    .withMessage('start_date is required')
    .isString().withMessage('start_date mus be a string')
    .trim(),

  body('end_date')
    .not()
    .isEmpty().withMessage('end_date is required')
    .isString().withMessage('end_date must be a string')
    .trim(),

    body('batch_manager')
    .not()
    .isEmpty()
    .withMessage('batch_manager is required')
    .isString().withMessage('batch_manager mus be a string')
    .trim(),

    body('duration')
    .not()
    .isEmpty()
    .withMessage('duration is required')
    .isNumeric().withMessage('duration mus be a number')
    .trim(),

    body('instructor_name')
    .not()
    .isEmpty()
    .withMessage('instructor_name is required')
    .isString().withMessage('instructor_name mus be a string')
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
  
  