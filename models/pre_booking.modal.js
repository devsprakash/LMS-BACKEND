const mongoose = require('mongoose');


// Define user schema
const BookingSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    full_name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    course_name: {
        type: String
    },
    gender: {
        type: String,
        default: null
    },
    city: {
        type: String,
    },
    adharcard:{
        type:Number
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



const Booking = mongoose.model('Bookings', BookingSchema);
module.exports = Booking;
