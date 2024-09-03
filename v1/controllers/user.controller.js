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
const {sendMail}  = require('../../services/email.services')



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
            gender:user.gender,
            phone:user.phone,
            course_name:user.course_name,
            city:user.city,
            created_at:user.created_at,
            updated_at:user.updated_at
        }

let text = `Welcome to ATIIT GLOBAL PRIVATE LIMITED! 🎉

Dear ${[user.full_name]},

We are thrilled to welcome you to ATIIT GLOBAL PRIVATE LIMITED! Congratulations on successfully registering with us.

Here’s what you can look forward to:

A World-Class Learning Experience
Dive into our extensive range of courses designed to enhance your skills and knowledge in various fields.

Access to Industry Experts
Get direct access to top professionals in the industry through our mentor sessions and live webinars.

Personalized Learning Paths
Our courses are tailored to meet your specific career goals. Whether you're a beginner or an experienced professional, we have something for everyone.

Networking Opportunities
Join our community of like-minded learners and industry professionals to expand your network and explore new opportunities.

24/7 Support
Our dedicated support team is here to assist you at every step of your learning journey.

Placed in Top Companies
Benefit from our placement assistance program designed to help you secure job opportunities in top companies.

Explore Our Courses:

Advanced Certification in Gen AI
Advanced Certification in IOT-Industrial Automation
Advanced Certification in Wireless Technology
Advanced Certification in Microelectronics and Semiconductor Technology
Advanced Certification in Cloud Computing
Advanced Certification in Cyber Security
Advanced Certification in Embedded Systems
Advanced Training in Mineral Exploration
Advanced Training in Space Science
Advanced Training in Blue Economy
Advanced Training in Energy Resources
Advanced Training in Renewable Energy
Advanced Training in Full Stack Development (MERN)
Advanced Training in Full Stack Development With Python
Advanced Certification in Natural Language Processing
Exclusive Benefits:

- Flexible Learning Schedules
  Study at your own pace with our flexible learning options.

- Certification
  Earn a globally recognized certificate upon course completion.

- Career Support
  Receive guidance from our career experts to help you land your dream job.

- Placed in Top Companies
  Our placement assistance program will connect you with leading companies in your industry.
  We’re excited to have you on board and look forward to supporting your learning journey.

Best regards,
ATIIT GLOBAL PRIVATE LIMITED
Visit our Website: https://atiitglobal.com/
Contact us: support@atiitglobal.com`

    sendMail(text , user.email).then(() => {
        console.log('successfully send the email')
    }).catch((err) => {
        console.log('email not send' , err)
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
      
        const existing_email = await User.findOne({ email: reqBody.email });

        if (existing_email)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.exist_email', {}, req.headers.lang);
      
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