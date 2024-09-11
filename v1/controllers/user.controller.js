const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    sendResponse
} = require('../../services/common.service')
const dateFormat = require('../../helper/dateformat.helper');
const User = require('../../models/user.model');
const TalkToExpert = require('../../models/talk_to_export.modal')
const BrochureDownload = require('../../models/brochure_download')
const DiscountForm = require('../../models/discount_form.modal');
const Story = require('../../models/success_story_modal');
const Blog = require('../../models/post_blog_modal');
const {
    Usersave,
} = require('../services/user.service');
const constants = require('../../config/constants')
const {
    JWT_SECRET , BASEURL
} = require('../../keys/development.keys');
const {
    isValid
} = require('../../services/blackListMail')
const { sendMail }  = require('../../services/email.services')





exports.Register= async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
      
        const existing_email = await User.findOne({ email: reqBody.email });

        if (existing_email)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.exist_email', {}, req.headers.lang);
      
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        reqBody.tempTokens = await jwt.sign({
            data: reqBody.email
        }, JWT_SECRET, {
            expiresIn: constants.URL_EXPIRE_TIME
        })

        reqBody.device_type = (reqBody.device_type) ? reqBody.device_type : null;
        reqBody.device_token = (reqBody.device_token) ? reqBody.device_token : null;

        const user = await Usersave(reqBody);
        const responseData = {
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            user_type: user.user_type,
            social_media:user.social_media,
            gender:user.gender,
            phone:user.phone,
            course_name:user.course_name,
            city:user.city,
            created_at:user.created_at,
            updated_at:user.updated_at
        }

    sendMail(user.email , user.full_name).then(() => {
        console.log('successfully send the email.............')
    }).catch((err) => {
        console.log('email not send.........' , err)
    })

      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.signUp_success', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(Register)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.talk_to_expert = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
    
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = await TalkToExpert.create(reqBody);
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone:user.phone,
            course_name:user.course_name,
            created_at:user.created_at,
            updated_at:user.updated_at
        }

      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.talk_to_expert', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(talk_to_expert)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.brochure_download = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
      
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = await BrochureDownload.create(reqBody);
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone:user.phone,
            created_at:user.created_at,
            updated_at:user.updated_at
        }

      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.brochure_download_success', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(brochure_download)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.ews_discount_form = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
      
        const existing_email = await User.findOne({ email: reqBody.email });

        if (existing_email)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.exist_email', {}, req.headers.lang);
      
        const existing_phone = await User.findOne({ phone: reqBody.phone });

        if (existing_phone)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.exist_email', {}, req.headers.lang);
      
        if (!req.file)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_image_upload', {}, req.headers.lang);
        
        console.log("data..." , req.file);
        const ews_certificate_url = `${BASEURL}/uploads/${req.file.filename}`;

        reqBody.ews_certificate = ews_certificate_url;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = await DiscountForm.create(reqBody);
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone:user.phone,
            city: user.city,
            adharacard:user.adharacard,
            pancard:user.pancard,
            ews_certificate:user.ews_certificate,
            course_name:user.course_name,
            created_at:user.created_at,
            updated_at:user.updated_at
        }

      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.fill_the_form_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(ews_discount_form)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.discount_form = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
      
        const existing_email = await User.findOne({ email: reqBody.email });

        if (existing_email)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.exist_email', {}, req.headers.lang);
      
        const existing_phone = await User.findOne({ phone: reqBody.phone });

        if (existing_phone)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.exist_email', {}, req.headers.lang);
      
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = await DiscountForm.create(reqBody);
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone:user.phone,
            city: user.city,
            adharacard:user.adharacard,
            pancard:user.pancard,
            course_name:user.course_name,
            created_at:user.created_at,
            updated_at:user.updated_at
        }

      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.fill_the_form_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(discount_form)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.AllUsers = async (req, res, next) => {

    try {

     const allUsers = await User.find();
      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.fill_the_form_successfully', allUsers , req.headers.lang);

    } catch (err) {
        console.log("err(discount_form)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.post_your_story = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
    
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = await Story.create(reqBody);
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            descripation:user.descripation,
            created_at:user.created_at,
            updated_at:user.updated_at
        }

      return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.successfully_post_your_story', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(post_your_story)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.post_blog = async (req, res, next) => {

    try {

        const reqBody = req.body;

        if (!req.file)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_image_upload', {}, req.headers.lang);
        
        console.log("data..." , req.file);
        const blog_image_url = `${BASEURL}/uploads/${req.file.filename}`;

        reqBody.blog_image = blog_image_url;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = await Blog.create(reqBody);
        const responseData = {
            _id: user._id,
            blog_name: user.blog_name,
            blog_title:user.blog_title,
            blog_image: user.blog_image,
            blog_category:user.blog_category,
            blog_content:user.blog_content,
            created_at:user.created_at,
            updated_at:user.updated_at
        }

      return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.successfully_post_your_blog', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(post_blog)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}

