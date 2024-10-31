
const mongoose = require('mongoose');


// Define user schema
const EnrollSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    name: {
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
    pincode:{
        type:Number
    },
    city:{
        type:String
    },
    tenth_certificate: {
        type: String
    },
    plus_two_certificate: {
        type: String
    },
    other_certificate: {
        type: String
    },
    pancard: {
        type: String
    },
    adharcard:{
        type:String
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


const Enroll = mongoose.model('course_enroll', EnrollSchema);
module.exports = Enroll;
