const mongoose = require('mongoose');


// Define user schema
const TalkToExpertSchema = new mongoose.Schema({

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


const TalkToExpert = mongoose.model('TalkToExpert', TalkToExpertSchema);
module.exports = TalkToExpert;
