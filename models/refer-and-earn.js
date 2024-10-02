
const mongoose = require('mongoose');


const ReferAndEarnSchema = new mongoose.Schema({

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
    course_name:{
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


const ReferAndEarn = mongoose.model('ReferAndEarn', ReferAndEarnSchema);
module.exports = ReferAndEarn;
