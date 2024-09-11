
const mongoose = require('mongoose');


// Define user schema
const EnrollSchema = new mongoose.Schema({

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


const Enroll = mongoose.model('Enroll', EnrollSchema);
module.exports = Enroll;
