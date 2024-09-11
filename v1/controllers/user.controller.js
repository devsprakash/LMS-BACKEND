const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    sendResponse
} = require('../../services/common.service')
const dateFormat = require('../../helper/dateformat.helper');
const User = require('../../models/user.model');
const TalkToExpert = require('../../models/talk_to_export.modal')
const BrochureDownload = require('../../models/brochure_download')
const Story = require('../../models/success_story_modal');
const Blog = require('../../models/post_blog_modal');
const Booking = require('../../models/pre_booking.modal');
const Hiring = require('../../models/hiring_sharing.modal');
const Enroll = require('../../models/course-enroll_form');
const EnrollDocument = require('../../models/enrollent_documents');
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
const { sendMail , BookingSendMail , EnrollSendMail }  = require('../../services/email.services')





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



exports.Booking = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
      
        
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const booking = await Booking.create(reqBody);
        const responseData = {
            _id: booking._id,
            full_name: booking.full_name,
            email: booking.email,
            gender:booking.gender,
            phone:booking.phone,
            course_name:booking.course_name,
            adharcard:booking.adharcard,
            city:booking.city,
            created_at:booking.created_at,
            updated_at:booking.updated_at
        }

    BookingSendMail(booking.full_name , booking.email , booking.course_name).then(() => {
        console.log('successfully send the email.............')
    }).catch((err) => {
        console.log('email not send.........' , err)
    })

      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.successfully_booking_your_seat', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(Booking)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.HiringRequirements = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.work_email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
      
        if (!req.file)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_image_upload', {}, req.headers.lang);
        
        console.log("data..." , req.file);
        const image_url = `${BASEURL}/uploads/${req.file.filename}`;

        reqBody.additional_file = image_url;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const hiring = await Hiring.create(reqBody);
        const responseData = {
            _id: hiring._id,
            name: hiring.name,
            work_email: hiring.work_email,
            phone_number:hiring.phone_number,
            your_requirements: hiring.your_requirements,
            additional_file: hiring.additional_file,
            company:hiring.company,
            created_at:hiring.created_at,
            updated_at:hiring.updated_at
        }

      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.your_hiring_requirements', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(HiringRequirements)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.course_enroll_form = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
    
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const enroll = await Enroll.create(reqBody);
        const responseData = {
            _id: enroll._id,
            name: enroll.name,
            email: enroll.email,
            phone:enroll.phone,
            city: enroll.city,
            pincode:enroll.pincode,
            course_name:enroll.course_name,
            created_at:enroll.created_at,
            updated_at:enroll.updated_at
        }

      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.enrollment_form_sumbit_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(course_enroll_form)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.course_enroll_documents = async (req, res, next) => {

    try {

        const reqBody = req.body;

        if (!req.files || Object.keys(req.files).length === 0) 
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_file_uploaded', {}, req.headers.lang);
        
        const tenth_certificate_url = req.files.tenth_certificate ? req.files.tenth_certificate[0].path : null;
        const plus_two_certificate_url = req.files.plus_two_certificate ? req.files.plus_two_certificate[0].path : null;
        const graduation_certificate_url = req.files.graduation_certificate ? req.files.graduation_certificate[0].path : null;
        const pancard_url = req.files.pancard ? req.files.pancard[0].path : null;
        const adharcard_url = req.files.adharcard ? req.files.adharcard[0].path : null;

        if (!tenth_certificate_url || !plus_two_certificate_url || !graduation_certificate_url || !pancard_url || !adharcard_url) 
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.missing_documnets', {}, req.headers.lang);
    
        reqBody.tenth_certificate = tenth_certificate_url;
        reqBody.plus_two_certificate = plus_two_certificate_url,
        reqBody.graduation_ertificate = graduation_certificate_url;
        reqBody.pancard = pancard_url,
        reqBody.adharcard = adharcard_url,
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const documents = await EnrollDocument.create(reqBody);
        const responseData = {
            _id: documents._id,
            tenth_certificate:documents.tenth_certificate,
            plus_two_certificate:documents.plus_two_certificate,
            graduation_ertificate: documents.graduation_ertificate,
            pancard:documents.pancard,
            adharcard:documents.adharcard,
            created_at:documents.created_at,
            updated_at:documents.updated_at
        }

        EnrollSendMail("prakash" , "psamantaray77@gmail.com" , "Generative AI").then(() => {
            console.log('successfully send the email.............')
        }).catch((err) => {
            console.log('email not send.........' , err)
        })
    
      return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.your_documents_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(course_enroll_documents)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}