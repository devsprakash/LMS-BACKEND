
const { sendResponse } = require('../../services/common.service')
const constants = require('../../config/constants');
const Admin = require('../../admin_models/user.model');
const { NewUserWelcomeEmail} = require('../../services/email.services')
const {
    isValid
} = require('../../services/blackListMail')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dateFormat = require('../../helper/dateformat.helper');
const { JWT_SECRET } = require('../../keys/development.keys');




exports.addUsers = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const checkMail = await isValid(reqBody.email);
        let Newpassword = reqBody.password;

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const existing_email = await Admin.findOne({ email: reqBody.email });

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

        const user = await Admin.create(reqBody);

        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            user_type: user.user_type,
            phone: user.phone,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
      
        console.log("password" , Newpassword)
        NewUserWelcomeEmail(user.name , user.email , Newpassword).then(() => {
            console.log('successfully send the email.............')
        }).catch((err) => {
            console.log('email not send.........', err)
        })

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'ADMIN.user', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(addUsers)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
};



exports.login = async (req, res) => {

    const reqBody = req.body;

    try {

        let user = await Admin.findByCredentials(reqBody.email, reqBody.password); 

        if (user.user_type !== constants.USER_TYPE.ADMIN && user.user_type !== constants.USER_TYPE.SUPERADMIN)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.unauthorized_user', {}, req.headers.lang);

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.invalid_username_password', {}, req.headers.lang);
        if (user == 1) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.email_not_found', {}, req.headers.lang);
        if (user == 2) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.invalid_password', {}, req.headers.lang);
        if (user.status == 0) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.inactive_account', {}, req.headers.lang);
        if (user.status == 2) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.deactive_account', {}, req.headers.lang);
        if (user.deleted_at != null) return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.inactive_account', {}, req.headers.lang);

        await user.generateAuthToken();
        await user.generateRefreshToken();

        const responseData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            tokens: user.tokens,
            user_type: user.user_type,
            refresh_tokens: user.refresh_tokens,
            phone: user.phone,
        }

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.login_success', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(login)", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.logout = async (req, res) => {

    try {

        const reqBody = req.admin
        let UserData = await Admin.findById(reqBody._id)

        UserData.tokens = null
        UserData.refresh_tokens = null

        await UserData.save()

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.logout_success', {}, req.headers.lang);

    } catch (err) {
        console.log("err(logout)........", err)
        sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.reset_password = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const userId = req.admin._id
        const { new_password , confirm_password } = reqBody;
    
        if(new_password !== confirm_password)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.password_mismatch', {}, req.headers.lang);
        
        const user = await Admin.findById(userId);
      
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



exports.forgot_password = async (req, res, next) => {

    try {

        const reqBody = req.body;

        const { new_password , confirm_password } = reqBody;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);
        
        if(new_password !== confirm_password)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.password_mismatch', {}, req.headers.lang);
        
        const user = await Admin.findOne({ email: reqBody.email });
      
        if(!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        const hashedPassword = await bcrypt.hash(new_password, 10); 
        user.password = hashedPassword;
        await user.save();

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.forgot_password', user,  req.headers.lang);

    } catch (err) {
        console.log("err(forgot_password)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


exports.change_role = async (req, res, next) => {

    try {
        
        const { userid } = req.param
        const userId = req.superAdmin._id;
        const user = await Admin.findOne({ _id: userId });
      
        if(!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        const users = await Admin.findById(userid);
        users.user_type = reqBody.userType;
        await user.save();
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'ADMIN.role_change', user,  req.headers.lang);

    } catch (err) {
        console.log("err(change_role)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


exports.admin_list = async (req, res, next) => {

    try {
        
        const userId = req.superAdmin._id;
        const user = await Admin.findById(userId);

        if(!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
         const page = parseInt(req.query.page, 10) || 1; 
         const limit = parseInt(req.query.limit, 10) || 10; 
         const skip = (page - 1) * limit;
 
         const totalAdmins = await Admin.countDocuments();
         const users = await Admin.find()
             .skip(skip)
             .limit(limit)
             .lean(); 

        if(!users || users.length == 0)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', [], req.headers.lang);
 
         const responseData = {
             totalAdmins,
             currentPage: page,
             totalPages: Math.ceil(totalAdmins / limit),
             users,
         };
 
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'ADMIN.admin_list', responseData,  req.headers.lang);

    } catch (err) {
        console.log("err(admin_list)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.update_admin = async (req, res, next) => {

    try {
        
        const reqBody = req.body;
        const { adminId } = req.query
        const userId = req.superAdmin._id;

        const user = await Admin.findById(userId);
        if(!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        const admin = await Admin.findById(adminId);
        if(!admin)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'ADMIN.admin_not_found', {}, req.headers.lang);
        
        admin.name = reqBody.name;
        admin.email = reqBody.email;
        admin.phone = reqBody.phone;
        await admin.save()

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'ADMIN.update_admin_details', admin , req.headers.lang);

    } catch (err) {
        console.log("err(update_admin)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.delete_admin = async (req, res, next) => {

    try {
        
        const { adminId } = req.query
        const userId = req.superAdmin._id;

        const user = await Admin.findById(userId);

        if(!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        const admin = await Admin.findByIdAndDelete(adminId);

        if(!admin)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'ADMIN.admin_not_found', {}, req.headers.lang);

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'ADMIN.delete_admin', admin, req.headers.lang);

    } catch (err) {
        console.log("err(delete_admin)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}