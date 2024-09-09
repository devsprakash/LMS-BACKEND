const express = require('express');
const router = express.Router();
const { user_validator, talk_to_expert_validator, brochure_download_validator , discount_form_validator, post_blog_validation, post_story_validation, ValidatorResult } = require('../../validation/user.validator')
const { Register , talk_to_expert , brochure_download ,ews_discount_form , discount_form, AllUsers, post_your_story, post_blog } = require('../controllers/user.controller')
const upload  = require('../../middleware/multer')


router.post('/signUp', user_validator, ValidatorResult, Register)
router.post('/talk_to_expert' , talk_to_expert_validator , ValidatorResult , talk_to_expert)
router.post('/brochure_download' , brochure_download_validator , ValidatorResult , brochure_download)
router.post('/ews_discount_form' , upload.single('ews_certificate'), discount_form_validator , ValidatorResult , ews_discount_form)
router.post('/discount_form' ,  discount_form_validator , ValidatorResult , discount_form);
router.post('/post_story' , post_story_validation , ValidatorResult, post_your_story);
router.post('/post_blog' , upload.single('blog_image') , post_blog_validation, ValidatorResult, post_blog);
router.get('/AllUsers' , AllUsers)


module.exports = router;
