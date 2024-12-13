
const {
    sendResponse
} = require('../../services/common.service')
const User = require('../../models/user.model');
const constants = require('../../config/constants');
const Admin = require('../../admin_models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




exports.user_list = async (req, res, next) => {

    try {
        
        const userId = req.superAdmin._id;
        const user = await Admin.findById(userId);

        if(!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
         const page = parseInt(req.query.page, 10) || 1; 
 
         const totalUsers = await User.countDocuments();
         const users = await User.find({ user_type: "USER" }).lean(); 

        if(!users || users.length == 0)
            return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.user_not_found', [], req.headers.lang);
 
         const responseData = {
             totalUsers,
             currentPage: page,
             users,
         };
 
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.user_list', responseData,  req.headers.lang);

    } catch (err) {
        console.log("err(user_list)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}


exports.delete_user = async (req, res, next) => {

    try {
        
        const { userId } = req.query
        const adminId = req.superAdmin._id;

        const user = await Admin.findById(adminId);
        if(!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        
        const users = await User.findByIdAndDelete(userId);
        if(!users)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);


        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.delete_users', users, req.headers.lang);

    } catch (err) {
        console.log("err(delete_user)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.reset_passwords = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const adminId = req.superAdmin._id;
        const { userId } = req.query;
        const { new_password , confirm_password} = reqBody;

        const admin = await Admin.findById(adminId);

        if(!admin)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        if(new_password !== confirm_password)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.password_mismatch', {}, req.headers.lang);

        const user = await User.findById(userId)
        const hashedPassword = await bcrypt.hash(new_password, 10); 
        user.password = hashedPassword;
        await user.save();
 
        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.set_new_password_success', user , req.headers.lang);

    } catch (err) {
        console.log("err(reset_password)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}



exports.user_status_updated = async (req, res, next) => {

    try {

        const adminId = req.superAdmin._id;
        const { userId } = req.query;

        const admin = await Admin.findById(adminId);

        if(!admin)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        const user = await User.findById(userId);
        user.status = user.status === 1 ? 0 : 1; 
        await user.save();

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.user_status_updated', user , req.headers.lang);

    } catch (err) {
        console.log("err(user_status_updated)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}