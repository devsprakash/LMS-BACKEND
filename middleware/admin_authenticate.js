const jwt = require('jsonwebtoken');
const constants = require('../config/constants')
const { sendResponse } = require('../services/common.service');
const { JWT_SECRET } = require('../keys//development.keys');
const Admin = require('../admin_models/user.model');




let adminAuthenticate = async (req, res, next) => {

    try {

        if (!req.header('Authorization')) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'GENERAL.unauthorized_user', {}, req.headers.lang);

        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.not_token', {}, req.headers.lang)

        const decoded = await jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findOne({
            _id: decoded._id,
            tokens: token,
            user_type: { $in: ['SUPER ADMIN', 'ADMIN'] }
        }).lean();
        
        console.log("user_data" , admin)

        if (!admin) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'GENERAL.unauthorized_user', {}, req.headers.lang)

        if (admin.status == 0) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'USER.inactive_account', {}, req.headers.lang);
        if (admin.status == 2) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'USER.deactive_account', {}, req.headers.lang);
        if (admin.deleted_at != null) return sendResponse(res, constants.WEB_STATUS_CODE.UNAUTHORIZED, constants.STATUS_CODE.UNAUTHENTICATED, 'USER.delete_account', {}, req.headers.lang);
     
        req.token = token;
        req.admin = admin;

        next();

    } catch (err) {
        console.log(err)
       return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
}

module.exports = adminAuthenticate;