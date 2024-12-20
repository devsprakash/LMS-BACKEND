
const {
    sendResponse
} = require('../../services/common.service')
const dateFormat = require('../../helper/dateformat.helper');
const seatBooking = require('../../models/seat_booking');
const User = require('../../models/user.model');
const constants = require('../../config/constants');
const {
    isValid
} = require('../../services/blackListMail');
const axios = require('axios');
const Admin = require('../../admin_models/user.model');




exports.seatBooking = async (req, res, next) => {

    try {

        const reqBody = req.body;
        const userId = req.user._id;
        const checkMail = await isValid(reqBody.email);

        if (!checkMail)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'GENERAL.blackList_mail', {}, req.headers.lang);

        const loginedIn = await User.findOne({ _id: userId });

        if (loginedIn.tokens === null && loginedIn.refresh_tokens === null)
            return sendResponse(res, constants.WEB_STATUS_CODE.BAD_REQUEST, constants.STATUS_CODE.FAIL, 'USER.loginedIn_success', {}, req.headers.lang);

        const options = {
            method: 'POST',
            url: 'https://api.razorpay.com/v1/orders',
            auth: {
                username: 'rzp_live_6pmqjNtXITyYIv',  // Replace with your Razorpay Key ID
                password: 'x4S4xdEYSxgaNk4Bu5y6JrmX' // Replace with your Razorpay Key Secret
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

        const user = await seatBooking.create(reqBody);

        const responseData = {
            _id: user._id,
            user:user.user,
            name: user.name,
            email: user.email,
            phone: user.phone,
            course_name:user.course_name,
            amount:user.amount,
            payment_status:user.payment_status,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        return sendResponse(res, constants.WEB_STATUS_CODE.CREATED, constants.STATUS_CODE.SUCCESS, 'USER.registartion_successfully', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(seatBooking)........", err)
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

        const [booking, totalBookings] = await Promise.all([
            booking.find().skip(skip).limit(limit),   
            booking.countDocuments()
        ]);

        if (!booking || booking.length === 0) 
            return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.seat_booking_data_not_found', [], req.headers.lang);
        
        const responseData = {
            totalBookings,
            currentPage: page,
            totalPages: Math.ceil(totalBookings / limit),
            bookings: booking.map(batch => ({
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

        return sendResponse(res, constants.WEB_STATUS_CODE.OK, constants.STATUS_CODE.SUCCESS, 'USER.seat_booking_list', responseData, req.headers.lang);

    } catch (err) {
        console.log("err(BatchList)........", err);
        return sendResponse(res, constants.WEB_STATUS_CODE.SERVER_ERROR, constants.STATUS_CODE.FAIL, 'GENERAL.general_error_content', err.message, req.headers.lang);
    }
};
