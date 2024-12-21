
const mongoose = require('mongoose');


const seatBookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    course_name:{
       type:String
    },
    amount:{
        type:Number
    },
    payment_status:{
      type: String,
      enum:['paid','unpaid'],
      default:'unpaid'
    },
    created_at: {
        type: String
    },
    updated_at: {
        type: String
    },
    deleted_at: {
        type: String,
        default: null
    }
});


const seatBooking = mongoose.model('seatBookings', seatBookingSchema);
module.exports = seatBooking;
