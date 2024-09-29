const express = require('express');
const router = express.Router();
const { user_validator, login_validator , verify_email_validator , reset_password_validator, forgot_password_validator , contact_us_validator , talk_to_expert_validator, enroll_form_validator, hiring_validator, brochure_download_validator , booking_validator , post_blog_validation, post_story_validation, ValidatorResult } = require('../../validation/user.validator')
const { Register , talk_to_expert , post_your_story, post_blog, Booking, HiringRequirements, course_enroll, login, contact_us, forgot_password, reset_password, verify_email } = require('../controllers/user.controller')
const upload  = require('../../middleware/multer');
const authenticate = require('../../middleware/authenticate')




router.post('/signUp', user_validator, ValidatorResult, Register)
router.post('/login' , login_validator, ValidatorResult , login)
router.post('/talk_to_expert' , talk_to_expert_validator , ValidatorResult , talk_to_expert)
router.post('/post_story' , post_story_validation , ValidatorResult, authenticate , post_your_story);
router.post('/post_blog' , upload.single('blog_image') , post_blog_validation, ValidatorResult, authenticate , post_blog);
router.post('/booking_seat' , booking_validator , ValidatorResult , authenticate , Booking)
router.post('/hiring_requirements' , upload.single('additional_file') , hiring_validator , ValidatorResult , authenticate,  HiringRequirements)
router.post('/course_enrollment_form', upload.fields([
        { name: 'tenth_certificate', maxCount: 1 },
        { name: 'plus_two_certificate', maxCount: 1 },
        { name: 'graduation_certificate', maxCount: 1 },
        { name: 'pancard', maxCount: 1 },
        { name: 'adharcard', maxCount: 1 }
    ]), enroll_form_validator, ValidatorResult, authenticate , course_enroll);
router.post('/contact_us' , contact_us_validator , ValidatorResult , contact_us)
router.post('/forgot_password' , forgot_password_validator , ValidatorResult , forgot_password );
router.post('/reset_password' , reset_password_validator , ValidatorResult , reset_password )
router.post('/verify_email' , verify_email_validator , ValidatorResult , verify_email)




module.exports = router;
