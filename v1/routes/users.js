const express = require('express');
const router = express.Router();
const { user_validator, login_validator,school_validator,python_register_validator,learner_validator , application_fees_details_validator , application_deatils_validator , application_fees_validator , apply_now_validator , resend_otp_validator , otp_validator , brochure_download_validator, call_back_validator , verify_email_validator , reset_password_validator, forgot_password_validator , contact_us_validator , talk_to_expert_validator, hiring_validator, booking_validator , post_blog_validation, post_story_validation, ValidatorResult, refer_and_earn_validator } = require('../../validation/user.validator')
const { Register , talk_to_expert , post_your_story,applyCoupon, post_blog,  Booking, HiringRequirements, login, contact_us, forgot_password, reset_password, verify_email, refer_and_Earn, arrange_call_back, apply_now, brochure_download, verify_otp, brochure_verify_otp, resend_otp, brchure_resend_otp, application_details, application_fees, upload_documents, order_summary, create_promocode, apply_promocode, get_application_fees_details, python_register, Learners_Corners, School_college } = require('../controllers/user.controller')
const upload  = require('../../middleware/multer');
const ResumeUpload  = require('../../middleware/resume_file');
const authenticate = require('../../middleware/authenticate');



router.post('/signUp', user_validator, ValidatorResult, Register)
router.post('/login' , login_validator, ValidatorResult , login)
router.post('/talk_to_expert' , talk_to_expert_validator , ValidatorResult , talk_to_expert)
router.post('/post_story' , post_story_validation , ValidatorResult, authenticate , post_your_story);
router.post('/post_blog' , upload.single('blog_image') , post_blog_validation, ValidatorResult, authenticate , post_blog);
router.post('/booking_seat' , booking_validator , ValidatorResult , authenticate , Booking)
router.post('/hiring_requirements' , upload.single('additional_file') , hiring_validator , ValidatorResult , authenticate,  HiringRequirements)
router.post('/contact_us' , contact_us_validator , ValidatorResult , contact_us)
router.post('/reset_password' , reset_password_validator , ValidatorResult , reset_password )
router.post('/refer_and_earn' , refer_and_earn_validator , ValidatorResult , authenticate , refer_and_Earn)
router.post('/arrange_call_back' , call_back_validator , ValidatorResult , arrange_call_back)
router.post('/apply_here' , ResumeUpload.single('resume') , apply_now_validator , ValidatorResult , apply_now)
router.post('/brochure_download' , brochure_download_validator , ValidatorResult , authenticate , brochure_download)
router.post('/verify_otp' , otp_validator , ValidatorResult , verify_otp);
router.post('/resend_otp' , resend_otp_validator , ValidatorResult , resend_otp);
router.post('/brochure_verify_otp' , otp_validator , ValidatorResult , brochure_verify_otp);
router.post('/brochure_resend_otp' , resend_otp_validator , ValidatorResult , brchure_resend_otp);
router.post('/application-details' , application_deatils_validator , ValidatorResult , authenticate , application_details  )
router.post('/application-fees' , application_fees_validator , ValidatorResult , authenticate , application_fees)
router.post('/order_summary' , authenticate , order_summary);
router.post('/generate_promocode' , create_promocode);
router.post('/python_register' , python_register_validator , ValidatorResult , python_register)
router.post('/applyCoupons', applyCoupon)
router.post('/learner_form_sumbit', learner_validator, ValidatorResult , authenticate , Learners_Corners )
router.post('/School_form_sumbit', school_validator , ValidatorResult , authenticate , School_college )




module.exports = router;
