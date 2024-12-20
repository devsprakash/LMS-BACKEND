
const { sendResponse } = require('../../services/common.service')
const constants = require('../../config/constants');
const Batch = require('../../models/batch.modal');
const Admin = require('../../admin_models/user.model');
const dateFormat = require('../../helper/dateformat.helper');
const { BASEURL } = require('../../keys/development.keys');




exports.addBatch = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const adminId = req.superAdmin._id;

        const user = await Admin.findById(adminId);

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const batch = await Batch.create(reqBody);

        const responseData = {
            _id: batch._id,
            batch_name: batch.batch_name,
            course_name: batch.course_name,
            start_date: batch.start_date,
            end_date: batch.end_date,
            duration: batch.duration,
            batch_manager: batch.batch_manager,
            instructor_name: batch.instructor_name,
            created_at: batch.created_at,
            updated_at: batch.updated_at
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'BATCH.add_batch', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(addBatch)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
};


exports.BatchList = async (req, res, next) => {

    try {

        const adminId = req.superAdmin._id;
        const user = await Admin.findById(adminId);

        if (!user) 
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [Batches, totalBatches] = await Promise.all([
            Batch.find().skip(skip).limit(limit),   
            Batch.countDocuments()
        ]);

        if (!Batches || Batches.length === 0) 
            return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'BATCH.batch_not_found', [], req.headers.lang);
        

        const responseData = {
            totalBatches,
            currentPage: page,
            totalPages: Math.ceil(totalBatches / limit),
            Batches: Batches.map(batch => ({
                _id: batch._id,
                batch_name: batch.batch_name,
                course_name: batch.course_name,
                duration: batch.duration,
                start_date: batch.start_date,
                end_date: batch.end_date,
                batch_manager: batch.batch_manager,
                instructor_name: batch.instructor_name,
                created_at: batch.created_at,
                updated_at: batch.updated_at
            }))
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'BATCH.get_batch_list', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(BatchList)........", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};


