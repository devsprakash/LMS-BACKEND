
const mongoose = require('mongoose');


const HiringSchema = new mongoose.Schema({

    name: {
        type: String
    },
    work_email: {
        type: String
    },
    company: {
        type: String
    },
    your_requirements: {
        type: String
    },
    phone_number: {
        type: Number
    },
    additional_file:{
        type:String,
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


const Hiring = mongoose.model('HiringRequirements', HiringSchema);
module.exports = Hiring;
