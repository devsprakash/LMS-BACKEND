const express = require('express');
const router = express.Router();
const { user_validator, talk_to_expert_validator, enroll_form_validator, hiring_validator, brochure_download_validator , booking_validator , post_blog_validation, post_story_validation, ValidatorResult } = require('../../validation/user.validator')
const { Register , talk_to_expert , brochure_download , post_your_story, post_blog, Booking, HiringRequirements, course_enroll_form, course_enroll_documents } = require('../controllers/user.controller')
const upload  = require('../../middleware/multer');





router.post('/signUp', user_validator, ValidatorResult, Register)
router.post('/talk_to_expert' , talk_to_expert_validator , ValidatorResult , talk_to_expert)
router.post('/brochure_download' , brochure_download_validator , ValidatorResult , brochure_download)
router.post('/post_story' , post_story_validation , ValidatorResult, post_your_story);
router.post('/post_blog' , upload.single('blog_image') , post_blog_validation, ValidatorResult, post_blog);
router.post('/booking_seat' , booking_validator , ValidatorResult , Booking)
router.post('/hiring_requirements' , upload.single('additional_file') , hiring_validator , ValidatorResult ,  HiringRequirements)
router.post('/enrollent_form' , enroll_form_validator , ValidatorResult , course_enroll_form)
router.post('/enrollment_documents_upload' , upload.fields([
    { name: 'tenth_certificate', maxCount: 1 },
    { name: 'plus_two_certificate', maxCount: 1 },
    { name: 'graduation_certificate', maxCount: 1 },
    { name: 'pancard', maxCount: 1 },
    { name: 'adharcard', maxCount: 1 }
]) , course_enroll_documents)





module.exports = router;
