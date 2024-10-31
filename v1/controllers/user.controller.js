const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    sendResponse
} = require('../../services/common.service')
const dateFormat = require('../../helper/dateformat.helper');
const User = require('../../models/user.model');
const TalkToExpert = require('../../models/talk_to_experts.modal')
const Story = require('../../models/success_story_modal');
const Blog = require('../../models/post_blog_modal');
const Booking = require('../../models/pre_booking.modal');
const Hiring = require('../../models/hiring_sharing.modal');
const Enroll = require('../../models/course_enroll');
const Brochure = require('../../models/brochure_download');
const Contact = require('../../models/contact_us');
const ReferAndEarn = require('../../models/refer-and-earn');
const Callback = require('../../models/arrang_call_back');
const Apply = require('../../models/Apply_here');
const {
    Usersave,
} = require('../services/user.service');
const constants = require('../../config/constants');
const {
    JWT_SECRET, BASEURL, ZOHO__LEAD_URL, ZOHO__CONTACT_URL
} = require('../../keys/development.keys');
const {
    isValid
} = require('../../services/blackListMail')
const { sendMail, BookingSendMail, EnrollSendMail , fetchZohoToken , OtpSendMail , generateFourDigitOTP } = require('../../services/email.services')
const passwordGenerator = require('password-generator');
const axios = require('axios');







exports.Register = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const existing_email = await User.findOne({ email: reqBody.email });

        if (existing_email)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.exist_email', {}, req.headers.lang);

        reqBody.password = await bcrypt.hash(reqBody.password, 10);
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        reqBody.tempTokens = await jwt.sign({
            data: reqBody.email
        }, JWT_SECRET, {
            expiresIn: constants.URL_EXPIRE_TIME
        })

        reqBody.device_type = (reqBody.device_type) ? reqBody.device_type : null;
        reqBody.device_token = (reqBody.device_token) ? reqBody.device_token : null;

        let newlead = {

            "data": [
                {
                    "Last_Name": reqBody.full_name,
                    "Email": reqBody.email,
                    "Phone": reqBody.phone,
                }
            ]
        }

   fetchZohoToken().then(token => {
            return axios.post(ZOHO__LEAD_URL, newlead, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            console.log('Lead created successfully:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });

     
        const user = await Usersave(reqBody);
        const responseData = {
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            password: user.password,
            user_type: user.user_type,
            social_media: user.social_media,
            gender: user.gender,
            phone: user.phone,
            course_name: user.course_name,
            city: user.city,
            privacy_policy:user.privacy_policy,
            term_and_condition:user.term_and_condition,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        sendMail(user.email, user.full_name).then(() => {
            console.log('successfully send the email.............')
        }).catch((err) => {
            console.log('email not send.........', err)
        })

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.signUp_success', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(Register)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.login = async (req, res, next) => {

    try {

        const reqBody = req.body

        let user = await User.findByCredentials(reqBody.email, reqBody.password, reqBody.user_type || '2');
        if (user == 1) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.email_not_found', {}, req.headers.lang);
        if (user == 2) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.invalid_password', {}, req.headers.lang);
        if (user.status == 0) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.inactive_account', {}, req.headers.lang);
        if (user.status == 2) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.deactive_account', {}, req.headers.lang);
        if (user.deleted_at != null) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.inactive_account', {}, req.headers.lang);

        let newToken = await user.generateAuthToken();
        let refreshToken = await user.generateRefreshToken()

        user.device_type = (reqBody.device_type) ? reqBody.device_type : null
        user.device_token = (reqBody.device_token) ? reqBody.device_token : null
        user.tokens = newToken;
        user.refresh_tokens = refreshToken;
        await user.save();

        const responseData = {
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            social_media: user.social_media,
            gender: user.gender,
            phone: user.phone,
            course_name: user.course_name,
            city: user.city,
            tokens: user.tokens,
            user_type: user.user_type,
            refresh_tokens: user.refresh_tokens,
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.login_success', responseData, req.headers.lang);

    } catch (err) {
        console.log('err(Login).....', err)
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

        let newlead = {
            "data": [
                {
                    "Last_Name": reqBody.name,
                    "Email": reqBody.email,
                    "Phone": reqBody.phone,
                }
            ]
        }

        fetchZohoToken().then(token => {
            return axios.post(ZOHO__LEAD_URL, newlead, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            console.log('Lead created successfully:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });


        const user = await TalkToExpert.create(reqBody);
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            course_name: user.course_name,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.talk_to_expert', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(talk_to_expert)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.forgot_password = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
        
        const user = await User.findOne({ email: reqBody.email });
      
        if(!user || user === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        const token = jwt.sign(reqBody.email , JWT_SECRET);
        user.reset_password_token = token;
        await user.save();

        const responseData = {
            _id: user._id,
            email: user.email,
            reset_password_token:token
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.forgot_password', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(forgot_password)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


exports.reset_password = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const { token , new_password , confirm_password } = reqBody;
    
        if(new_password !== confirm_password)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.password_mismatch', {}, req.headers.lang);
        
        const user = await User.findOne({ reset_password_token: token });
      
        if(!user || user === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.invalid_token', {}, req.headers.lang);
        
        const hashedPassword = await bcrypt.hash(new_password, 10); 
        user.password = hashedPassword;
        user.reset_password_token = null; 
        await user.save();
 
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.set_new_password_success', user , req.headers.lang);

    } catch (err) {
        console.log("err(reset_password)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


exports.contact_us = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        let newlead = {
            "data": [
                {
                    "Last_Name": reqBody.full_name,
                    "Email": reqBody.email,
                    "Phone": reqBody.phone,
                }
            ]
        }

        fetchZohoToken().then(token => {
            return axios.post(ZOHO__CONTACT_URL, newlead, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            console.log('Contact created successfully:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });


        const user = await Contact.create(reqBody);
        const responseData = {
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            message: user.message,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.successfully_created_contact_us', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(contact_us)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.arrange_call_back = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        let newlead = {
            "data": [
                {
                    "Last_Name": reqBody.name,
                    "Email": reqBody.email,
                    "Phone": reqBody.phone,
                }
            ]
        }

        fetchZohoToken().then(token => {
            return axios.post(ZOHO__CONTACT_URL, newlead, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            console.log('Contact created successfully:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.response ? error.response.data : error.message);
        });

        const user = await Callback.create(reqBody);

        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.successfully_created_contact_us', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(arrange_call_back)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}




exports.refer_and_Earn = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const userId = req.user._id;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
       
        const loginedIn = await User.findOne({ _id: userId});

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = await ReferAndEarn.create(reqBody);
        const responseData = {
            _id: user._id,
            user: userId,
            name: user.name,
            email: user.email,
            phone: user.phone,
            course_name:user.course_name,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.refer_and_earn', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(refer_and_Earn)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.verify_email = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
        
        const user = await User.findOne({ email: reqBody.email });
      
        if(!user || user === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        const responseData = {
            _id: user._id,
            email: user.email,
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.verify_email', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(verify_email)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.post_your_story = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const loginedIn = await User.findOne({ _id: userId});

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        reqBody.user = userId;
        const user = await Story.create(reqBody);
        const responseData = {
            _id: user._id,
            name: user.name,
            user:userId,
            email: user.email,
            descripation: user.descripation,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.successfully_post_your_story', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(post_your_story)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.post_blog = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const reqBody = req.body;

        const loginedIn = await User.findOne({ _id: userId});

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        if (!req.file)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_image_upload', {}, req.headers.lang);

        const blog_image_url = `${BASEURL}/uploads/${req.file.filename}`;

        reqBody.blog_image = blog_image_url;
        reqBody.user = userId;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = await Blog.create(reqBody);
        const responseData = {
            _id: user._id,
            user:userId,
            blog_name: user.blog_name,
            blog_title: user.blog_title,
            blog_image: user.blog_image,
            blog_category: user.blog_category,
            blog_content: user.blog_content,
            created_at: user.created_at,
            updated_at: user.updated_at
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
        const userId = req.user._id;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const loginedIn = await User.findOne({ _id: userId});

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        reqBody.user = userId;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const booking = await Booking.create(reqBody);
        const responseData = {
            _id: booking._id,
            user:userId,
            full_name: booking.full_name,
            email: booking.email,
            gender: booking.gender,
            phone: booking.phone,
            course_name: booking.course_name,
            adharcard: booking.adharcard,
            city: booking.city,
            created_at: booking.created_at,
            updated_at: booking.updated_at
        }

        BookingSendMail(booking.full_name, booking.email, booking.course_name).then(() => {
            console.log('successfully send the email.............')
        }).catch((err) => {
            console.log('email not send.........', err)
        })

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.successfully_booking_your_seat', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(Booking)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.HiringRequirements = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const reqBody = req.body;
        const checkMail = await isValid(reqBody.work_email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const loginedIn = await User.findOne({ _id: userId});

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        if (!req.file)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_image_upload', {}, req.headers.lang);

        const image_url = `${BASEURL}/uploads/${req.file.filename}`;

        reqBody.additional_file = image_url;
        reqBody.user = userId;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const hiring = await Hiring.create(reqBody);
        const responseData = {
            _id: hiring._id,
            user:userId,
            name: hiring.name,
            work_email: hiring.work_email,
            phone_number: hiring.phone_number,
            your_requirements: hiring.your_requirements,
            additional_file: hiring.additional_file,
            company: hiring.company,
            created_at: hiring.created_at,
            updated_at: hiring.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.your_hiring_requirements', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(HiringRequirements)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.course_enroll = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const loginedIn = await User.findOne({_id: userId});

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        if (!req.files)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_file_uploaded', {}, req.headers.lang);

        const tenth_certificate_url = req.files.tenth_certificate ? `${BASEURL}/uploads/${req.files.tenth_certificate[0].filename}` : null;
        const plus_two_certificate_url = req.files.plus_two_certificate ? `${BASEURL}/uploads/${req.files.plus_two_certificate[0].filename}` : null;
        const graduation_certificate_url = req.files.graduation_certificate ? `${BASEURL}/uploads/${req.files.graduation_certificate[0].filename}` : null;
        const pancard_url = req.files.pancard ? `${BASEURL}/uploads/${req.files.pancard[0].filename}` : null;
        const adharcard_url = req.files.adharcard ? `${BASEURL}/uploads/${req.files.adharcard[0].filename}` : null;


        if (!tenth_certificate_url || !plus_two_certificate_url || !pancard_url || !adharcard_url) 
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.missing_documents', {}, req.headers.lang);
        
        reqBody.tenth_certificate = tenth_certificate_url;
        reqBody.plus_two_certificate = plus_two_certificate_url;
        reqBody.graduation_certificate = graduation_certificate_url;
        reqBody.pancard = pancard_url;
        reqBody.adharcard = adharcard_url;
        reqBody.user = userId;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const enroll = await Enroll.create(reqBody);

        const responseData = {
            _id: enroll._id,
            user:userId,
            name: enroll.name,
            email: enroll.email,
            phone: enroll.phone,
            city: enroll.city,
            pincode: enroll.pincode,
            course_name: enroll.course_name,
            tenth_certificate: enroll.tenth_certificate,
            plus_two_certificate: enroll.plus_two_certificate,
            graduation_certificate: enroll.graduation_ertificate,
            pancard: enroll.pancard,
            adharcard: enroll.adharcard,
            created_at: enroll.created_at,
            updated_at: enroll.updated_at
        };



        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.enrollment_form_submit_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("Error in course_enroll: ", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};



exports.apply_now = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const reqBody = req.body;

        const checkMail = await isValid(reqBody.email);
        if (!checkMail) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
        }


        const loggedInUser = await User.findById(userId);
        if (!loggedInUser || (loggedInUser.tokens === null && loggedInUser.refresh_tokens === null)) {
            return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.FAIL, 'USER.loginedIn_failed', {}, req.headers.lang);
        }


        if (!req.file) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_file_uploaded', {}, req.headers.lang);
        }

        reqBody.resume = req.file.originalname ? `${BASEURL}/uploads/${req.file.originalname}` : null;
        const currentTimestamp = await dateFormat.set_current_timestamp();
        reqBody.created_at = currentTimestamp;
        reqBody.updated_at = currentTimestamp;

        const newApplication = await Apply.create(reqBody);

        const responseData = {
            _id: newApplication._id,
            user:userId,
            name: newApplication.name,
            email: newApplication.email,
            phone: newApplication.phone,
            position: newApplication.position,
            experience: newApplication.experience,
            resume: newApplication.resume,
            immediate_join: newApplication.immediate_join,
            created_at: newApplication.created_at,
            updated_at: newApplication.updated_at
        };

        // Return success response
        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.apply_successfully', responseData, req.headers.lang);

    } catch (err) {
        // Log the error and return a general error response
        console.error("Error in apply_now:", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};




exports.brochure_download = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const userId = req.user._id;

        const userData = await User.findById(userId);
        if(!userData)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.unauthorized_user', {}, req.headers.lang);

        const checkMail = await isValid(reqBody.email);
        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        reqBody.user = userId;
        const user = await Brochure.create(reqBody);

        const responseData = {
            _id: user._id,
            name: user.name,
            user:user.user,
            email: user.email,
            phone: user.phone,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.brochure_download_success', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(brochure_download)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


