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
const ApplicationDeatils = require('../../models/application-details');
const ApplicationFees = require('../../models/application-fees');
const Brochure = require('../../models/brochure_download');
const Contact = require('../../models/contact_us');
const ReferAndEarn = require('../../models/refer-and-earn');
const Callback = require('../../models/arrang_call_back');
const Events = require('../../models/python-registartion.modal');
const promoCode = require('../../models/promo_code');
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
const { sendMail, BookingSendMail, fetchZohoToken, PythonRegistrationInvoice, OtpSendMail, generateFourDigitOTP, finalInvoice, registrationInvoice, generateInvoiceNumber } = require('../../services/email.services')
const axios = require('axios');
const OrderSummary = require('../../models/final_payment');
const generator = require('random-password');
const crypto = require('crypto');
const Learner = require('../../models/Learners-corner');
const School = require('../../models/school_and_colleges')






exports.Register = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const existing_email = await User.findOne({ email: reqBody.email });

        if (existing_email)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.exist_email', {}, req.headers.lang);

        let passwords = generator(10);
        console.log(passwords)
        reqBody.password = await bcrypt.hash(passwords, 10);
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
                    "Lead_Source": reqBody.social_media,
                    "Description": reqBody.course_name,
                    "Company": reqBody.qualification
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
            phone: user.phone,
            qualification: user.qualification,
            course_name: user.course_name,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        sendMail(user.email, user.full_name, passwords).then(() => {
            console.log('successfully send the email.............')
        }).catch((err) => {
            console.log('email not send.........', err)
        })

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.signUp_success', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(Register)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
};


exports.verify_otp = async (req, res) => {

    try {

        const { otp, userId } = req.body;

        const user = await User.findById(userId);

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        // Verify OTP
        if (user.otp == otp) {
            user.otp = null; // Clear OTP after successful verification
            await user.save(); // Save the updated user data
            return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.verify_otp', {}, req.headers.lang);
        } else {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.invalid_otp', {}, req.headers.lang);
        }

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', { error: error.message }, req.headers.lang);
    }
};



exports.resend_otp = async (req, res) => {

    try {

        const { email, userId } = req.body;

        const user = await User.findOne({ email: email, _id: userId });

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        const otp = generateFourDigitOTP();

        OtpSendMail(otp, email).then(() => {
            console.log('successfully send the otp.............')
        }).catch((err) => {
            console.log('otp not send.........', err)
        });

        user.otp = otp;
        await user.save();

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.resend_otp', {}, req.headers.lang);

    } catch (error) {
        console.error('Error resend OTP:', error);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', { error: error.message }, req.headers.lang);
    }
};




exports.login = async (req, res, next) => {

    try {

        const reqBody = req.body

        let user = await User.findByCredentials(reqBody.email, reqBody.password, reqBody.user_type || 'USER');
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



exports.reset_password = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const { email, new_password, confirm_password } = reqBody;

        if (new_password !== confirm_password)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.password_mismatch', {}, req.headers.lang);

        const user = await User.findOne({ email });

        if (!user || user === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.invalid_token', {}, req.headers.lang);

        const hashedPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedPassword;
        user.reset_password_token = null;
        await user.save();

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.set_new_password_success', user, req.headers.lang);

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

        const loginedIn = await User.findOne({ _id: userId });

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
            course_name: user.course_name,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.refer_and_earn', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(refer_and_Earn)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.Learners_Corners = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);
        const userId = req.user._id;

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        reqBody.user = userId;
        const learner = await Learner.create(reqBody);

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.sumbit_successfully', learner, req.headers.lang);

    } catch (err) {
        console.log("err(Learners_Corners)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


exports.School_college = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);
        const userId = req.user._id;

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        reqBody.user = userId;

        const Schools = await School.create(reqBody);

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.school_form_sumbit', Schools, req.headers.lang);

    } catch (err) {
        console.log("err(School_college)")
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

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        reqBody.user = userId;
        const user = await Story.create(reqBody);
        const responseData = {
            _id: user._id,
            name: user.name,
            user: userId,
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

        const loginedIn = await User.findOne({ _id: userId });

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
            user: userId,
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

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        reqBody.user = userId;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const booking = await Booking.create(reqBody);
        const responseData = {
            _id: booking._id,
            user: userId,
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

        const loginedIn = await User.findOne({ _id: userId });

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
            user: userId,
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



exports.apply_now = async (req, res, next) => {

    try {

        const reqBody = req.body;

        const checkMail = await isValid(reqBody.email);

        if (!checkMail) {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
        }

        if (!req.file)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_file_uploaded', {}, req.headers.lang);

        reqBody.resume = req.file.originalname ? `${BASEURL}/uploads/${req.file.originalname}` : null;
        const currentTimestamp = await dateFormat.set_current_timestamp();
        reqBody.created_at = currentTimestamp;
        reqBody.updated_at = currentTimestamp;

        const newApplication = await Apply.create(reqBody);

        const responseData = {
            _id: newApplication._id,
            name: newApplication.name,
            email: newApplication.email,
            phone: newApplication.phone,
            position: newApplication.position,
            experience: newApplication.experience,
            resume: newApplication.resume,
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
        if (!userData)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.unauthorized_user', {}, req.headers.lang);


        const checkMail = await isValid(reqBody.email);
        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);


        let user = await Brochure.findOne({ user: userId });
        const otp = generateFourDigitOTP();
        reqBody.otp = otp;
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        if (user) {
            user.otp = otp;
            user.updated_at = reqBody.updated_at;
            await user.save();
        } else {
            reqBody.user = userId;
            reqBody.created_at = reqBody.updated_at;
            user = await Brochure.create(reqBody);
        }

        const responseData = {
            _id: user._id,
            name: user.name,
            user: user.user,
            email: user.email,
            phone: user.phone,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        OtpSendMail(otp, user.email).then(() => {
            console.log('Successfully sent the OTP.');
        }).catch((err) => {
            console.log('Failed to send OTP:', err);
        });

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.brochure_download_success', responseData, req.headers.lang);

    } catch (err) {
        console.log("Error (brochure_download):", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', { error: err.message }, req.headers.lang);
    }
};



exports.brochure_verify_otp = async (req, res) => {

    try {

        const { otp, userId } = req.body;

        const user = await Brochure.findOne({ user: userId });

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        if (user.otp == otp) {
            user.otp = null; // Clear OTP after successful verification
            await user.save(); // Save the updated user data
            return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.verify_otp', {}, req.headers.lang);
        } else {
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.invalid_otp', {}, req.headers.lang);
        }

    } catch (error) {
        console.error('Error brochure_verify_otp :', error);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', { error: error.message }, req.headers.lang);
    }
};


exports.brchure_resend_otp = async (req, res) => {

    try {

        const { email, userId } = req.body;

        const user = await Brochure.findOne({ email: email, user: userId });

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        const otp = generateFourDigitOTP();

        OtpSendMail(otp, email).then(() => {
            console.log('successfully send the otp.............')
        }).catch((err) => {
            console.log('otp not send.........', err)
        });

        user.otp = otp;
        await user.save();

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.resend_otp', {}, req.headers.lang);

    } catch (error) {
        console.error('Error brchure_resend_otp:', error);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', { error: error.message }, req.headers.lang);
    }
};



exports.application_details = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        reqBody.user = userId;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const enroll = await ApplicationDeatils.create(reqBody);

        const responseData = {
            _id: enroll._id,
            user: userId,
            name: enroll.name,
            email: enroll.email,
            phone: enroll.phone,
            state: enroll.state,
            location: enroll.location,
            city: enroll.city,
            gender: enroll.gender,
            date_of_birth: enroll.date_of_birth,
            highest_qualification: enroll.highest_qualification,
            specialization: enroll.specialization,
            institute_name: enroll.institute_name,
            passing_year: enroll.passing_year,
            working_professional: enroll.working_professional,
            work_experience: enroll.work_experience,
            company_name: enroll.company_name,
            created_at: enroll.created_at,
            updated_at: enroll.updated_at,
            deleted_at: enroll.deleted_at || null
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.application_details_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("Error in application_details: ", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};



exports.application_fees = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const reqBody = req.body;

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        const already_exist = await ApplicationFees.findOne({ user: userId , course_name:reqBody.course_name , payment_status : "Success"})

        if(already_exist)
            return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.registration_fees_completed', already_exist , req.headers.lang);

        
        const options = {
            method: 'POST',
            url: 'https://api.razorpay.com/v1/orders',
            auth: {
                username: 'rzp_live_6pmqjNtXITyYIv',
                password: 'x4S4xdEYSxgaNk4Bu5y6JrmX'
            },
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                amount: reqBody.amount * 100, // Amount in paise (10000 paise = ₹100.00)
                currency: 'INR'
            }
        };

        let response;

        try {
            response = await axios(options);
            console.log('Order created successfully:', response.data);
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error.message);
        }

        reqBody.user = userId;
        reqBody.amount = response.data.amount;
        reqBody.order_id = response.data.id;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const users = await User.findById(userId)
        const fees = await ApplicationFees.create(reqBody);

        const responseData = {
            _id: fees._id,
            user: userId,
            name: users.full_name,
            email: users.email,
            phone: users.phone,
            amount: fees.amount,
            course_name: fees.course_name,
            order_id: fees.order_id,
            created_at: fees.created_at,
            updated_at: fees.updated_at
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.application_details_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("Error in application_fees: ", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};





exports.order_summary = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const reqBody = req.body;

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        let totalAmount = reqBody.total_amount;
        let discountAmount = 0;

        if (reqBody.promo_code) {
            const promo = await promoCode.findOne({ promo_code: reqBody.promo_code, isActive: true });
            if (!promo)
                return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.promo_code_not_found', {}, req.headers.lang);

            discountAmount = promo.discount_amount || 0;
            totalAmount = totalAmount - discountAmount; // Ensure total amount is not negative
        }

        const options = {
            method: 'POST',
            url: 'https://api.razorpay.com/v1/orders',
            auth: {
                username: 'rzp_live_6pmqjNtXITyYIv',
                password: 'x4S4xdEYSxgaNk4Bu5y6JrmX'
            },
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                amount: totalAmount * 100, // Amount in paise (10000 paise = ₹100.00)
                currency: 'INR'
            }
        };

        let response;

        try {
            response = await axios(options);
            console.log('Order created successfully:', response.data);
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error.message);
        }

        reqBody.user = userId;
        reqBody.order_id = response.data.id;
        reqBody.total_amount = totalAmount;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const document = await OrderSummary.create(reqBody);
        const users = await User.findById(userId);

        const responseData = {
            _id: document._id,
            user: document.user,
            name: users.full_name,
            email: users.email,
            phone: users.phone,
            total_amount: document.total_amount,
            payment_status: document.payment_status,
            created_at: document.created_at,
            updated_at: document.updated_at,
            deleted_at: document.deleted_at,
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.payment_complete', responseData, req.headers.lang);

    } catch (err) {
        console.log("Error in order_summary: ", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};



exports.create_promocode = async (req, res, next) => {

    try {

        const reqBody = req.body;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + reqBody.expire_date);
        reqBody.expire_date = expirationDate;
        const promo = await promoCode.create(reqBody);

        const responseData = {
            _id: promo._id,
            promo_code: promo.promo_code,
            discount: promo.discount,
            expire_days: promo.expire_days,
            created_at: promo.created_at,
            updated_at: promo.updated_at,
            deleted_at: promo.deleted_at || null
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.create_promo_code', responseData, req.headers.lang);

    } catch (err) {
        console.log("Error in create promocode: ", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};




exports.apply_promocode = async (req, res, next) => {

    try {

        const userId = req.user._id;
        const { promo_code, total_amount } = req.query;

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);


        const promo = await promoCode.findOne({ promo_code: promo_code, isActive: true });

        if (!promo)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.promo_code_not_found', {}, req.headers.lang);

        if (new Date(promo.expire_days) < new Date())
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.promo_code_expired', {}, req.headers.lang);

        let discounts = (total_amount * promo.discount) / 100;
        const total_amounts = total_amount - discounts;
        promo.total_amount = total_amounts;
        promo.discount_amount = discounts;
        await promo.save();

        const responseData = {
            _id: promo._id,
            user: userId,
            promo_code: promo.promo_code,
            discount: promo.discount,
            discount_amount: promo.discount_amount,
            expire_days: promo.expire_days,
            total_amount: promo.total_amount,
            created_at: promo.created_at,
            updated_at: promo.updated_at,
            deleted_at: promo.deleted_at || null
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.apply_promo_code', responseData, req.headers.lang);

    } catch (err) {
        console.log("Error in create apply_promocode: ", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};




exports.python_register = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const options = {
            method: 'POST',
            url: 'https://api.razorpay.com/v1/orders',
            auth: {
                username: 'rzp_live_6pmqjNtXITyYIv',
                password: 'x4S4xdEYSxgaNk4Bu5y6JrmX'
            },
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                amount: reqBody.amount * 100,
                currency: 'INR'
            }
        };

        let response;

        try {
            response = await axios(options);
            console.log('Order created successfully:', response.data);
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error.message);
        }

        reqBody.order_id = response.data.id;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const user = new Events(reqBody);

        await user.save();
        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            order_id: user.order_id,
            created_at: user.created_at,
            updated_at: user.updated_at
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.python_registartion', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(python_register)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.payment_verification = async (req, res) => {

    const secret = '7290938999';
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);


    // Verify Razorpay signature
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (signature !== expectedSignature) {
        return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const paymentData = req.body.payload.payment.entity;
    const { order_id: orderId, status: paymentStatus } = paymentData;

    try {

        let foundRecord = false;

        const invoiceNumber = generateInvoiceNumber();
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

        const orderSummaryData = await OrderSummary.findOne({ order_id: orderId });
        if (orderSummaryData) {
            foundRecord = true;
            orderSummaryData.payment_status = mapPaymentStatus(paymentStatus);
            await orderSummaryData.save();

            try {
                await finalInvoice(
                    orderSummaryData.full_name,
                    orderSummaryData.email,
                    orderSummaryData.phone,
                    invoiceNumber,
                    formattedDate,
                    orderSummaryData.total_amount
                );
                console.log('Invoice email sent successfully for Order Summary.');
            } catch (emailError) {
                console.error('Failed to send email for Order Summary:', emailError);
            }
        }

        // Step 2: Check and process Events
        const event = await Events.findOne({ order_id: orderId });
        if (event) {
            foundRecord = true;
            event.payment_status = mapPaymentStatus(paymentStatus);
            await event.save();

            try {
                await PythonRegistrationInvoice(
                    event.name,
                    event.email,
                    event.phone,
                    invoiceNumber,
                    formattedDate
                );
                console.log('Invoice email sent successfully for Event.');
            } catch (emailError) {
                console.error('Failed to send email for Event:', emailError);
            }
        }

        // Step 3: Check and process ApplicationFees
        const applicationFees = await ApplicationFees.findOne({ order_id: orderId });
        console.log("application data......", applicationFees)
        if (applicationFees) {
            foundRecord = true;
            applicationFees.payment_status = mapPaymentStatus(paymentStatus);
            await applicationFees.save();
            console.log("status......", applicationFees)
            try {

                await registrationInvoice(
                    applicationFees.name,
                    applicationFees.email,
                    applicationFees.phone,
                    invoiceNumber,
                    formattedDate,
                );
                console.log('Invoice email sent successfully for Application Fees.');
            } catch (emailError) {
                console.error('Failed to send email for Application Fees:', emailError);
            }
        }

        if (!foundRecord)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.data_not_found', {}, req.headers.lang);


        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.verification_complete', {}, req.headers.lang);

    } catch (err) {
        console.error('Error in payment_verification:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


function mapPaymentStatus(status) {
    switch (status) {
        case 'captured':
            return 'Success';
        case 'failed':
            return 'Failed';
        default:
            return 'Pending';
    }
}
