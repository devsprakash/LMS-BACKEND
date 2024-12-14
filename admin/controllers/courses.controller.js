
const { sendResponse } = require('../../services/common.service')
const constants = require('../../config/constants');
const Course = require('../../models/courses.modal');
const Admin = require('../../admin_models/user.model');
const dateFormat = require('../../helper/dateformat.helper');
const { BASEURL } = require('../../keys/development.keys');





exports.addCourse = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const adminId = req.superAdmin._id;

        const user = await Admin.findById(adminId);

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        const existingCourse = await Course.findOne({ course_name: reqBody.course_name });

        if (existingCourse)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'COURSE.already_add_course', {}, req.headers.lang);

        if (!req.file)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.no_image_upload', {}, req.headers.lang);

        const course_image_url = `${BASEURL}/uploads/${req.file.filename}`;
        reqBody.course_image = course_image_url;
        reqBody.created_at = await dateFormat.set_current_timestamp();
        reqBody.updated_at = await dateFormat.set_current_timestamp();

        const course = await Course.create(reqBody);

        const responseData = {
            _id: user._id,
            course_name: course.course_name,
            course_image: course.course_image,
            course_duration: course.course_duration,
            isPublished: course.isPublished,
            created_at: course.created_at,
            updated_at: course.updated_at
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'COURSE.add_course', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(addUsers)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
};


exports.CourseList = async (req, res, next) => {

    try {

        const adminId = req.superAdmin._id;
        const user = await Admin.findById(adminId);

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [courses, totalPublished, totalCourse] = await Promise.all([
            Course.find().skip(skip).limit(limit),
            Course.countDocuments({ isPublished: "published" }),
            Course.countDocuments()
        ]);

        if (!courses || !totalPublished || !totalCourse)
            return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'COURSE.course_not_found', [], req.headers.lang);


        const responseData = {
            totalPublished,
            totalCourse,
            currentPage: page,
            totalPages: Math.ceil(totalPublished / limit),
            courses: courses.map(course => ({
                _id: course._id,
                course_name: course.course_name,
                course_image: course.course_image,
                course_duration: course.course_duration,
                isPublished: course.isPublished,
                created_at: course.created_at,
                updated_at: course.updated_at
            }))
        };


        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'COURSE.course_list', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(CourseList)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
};



exports.editCourse = async (req, res, next) => {

    try {

        const { courseId } = req.query;
        const adminId = req.superAdmin._id;
        const user = await Admin.findById(adminId);

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        const course = await Course.findById(courseId);

        if (!course) 
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'COURSE.course_not_found', {}, req.headers.lang);
        
        const updatedData = {
            ...req.body,
            updated_at: dateFormat.add_time_current_date()
        };

        const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

        const responseData = {
            _id: updatedCourse._id,
            course_name: updatedCourse.course_name,
            course_image: updatedCourse.course_image,
            course_duration: updatedCourse.course_duration,
            isPublished: updatedCourse.isPublished,
            created_at: updatedCourse.created_at,
            updated_at: updatedCourse.updated_at
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'COURSE.course_edit_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(EditCourse)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
};



exports.deleteCourse = async (req, res, next) => {

    try {

        const { courseId } = req.query;
        const adminId = req.superAdmin._id;
        const user = await Admin.findById(adminId);

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        const deleteCourse = await Course.findByIdAndDelete(courseId);

        if (!deleteCourse) 
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'COURSE.course_not_found', {}, req.headers.lang);

        const responseData = {
            _id: deleteCourse._id,
            course_name: deleteCourse.course_name,
            course_image: deleteCourse.course_image,
            course_duration: deleteCourse.course_duration,
            isPublished: deleteCourse.isPublished,
            created_at: deleteCourse.created_at,
            updated_at: deleteCourse.updated_at
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'COURSE.course_edit_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(deleteCourse)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
};



exports.editStatus = async (req, res, next) => {

    try {

        const { courseId } = req.query;
        const adminId = req.superAdmin._id;
        const user = await Admin.findById(adminId);

        if (!user)
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'USER.user_not_found', {}, req.headers.lang);

        const course = await Course.findById(courseId);

        if (!course) 
            return sendResponse(res, constants.WEB_STATUS_CODE.NOT_FOUND, constants.STATUS_CODE.FAIL, 'COURSE.course_not_found', {}, req.headers.lang);
        
        course.isPublished = course.isPublished === "published" ? "published" : "unpublished";
        await course.save();

        const responseData = {
            _id: course._id,
            course_name: course.course_name,
            isPublished: course.isPublished,
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'COURSE.course_status_updated', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(editStatus)........", err)
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang)
    }
};

