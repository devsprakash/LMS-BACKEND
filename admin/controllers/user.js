
const {
    sendResponse
} = require('../../services/common.service')
const User = require('../../models/user.model');
const constants = require('../../config/constants');
const Admin = require('../../admin_models/user.model');





exports.user_list = async (req, res, next) => {

    try {
        
        const userId = req.superAdmin._id;
        const user = await Admin.findById(userId);

        if(!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
         const page = parseInt(req.query.page, 10) || 1; 
         const limit = parseInt(req.query.limit, 10) || 10; 
         const skip = (page - 1) * limit;
 
         const totalUsers = await User.countDocuments();
         const users = await User.find({ user_type: "USER" })
             .skip(skip)
             .limit(limit)
             .lean(); 

        if(!users || users.length == 0)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', [], req.headers.lang);
 
         const responseData = {
             totalUsers,
             currentPage: page,
             totalPages: Math.ceil(totalUsers / limit),
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