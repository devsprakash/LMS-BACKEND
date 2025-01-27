const mongoose = require('mongoose');


const SchoolSchema = new mongoose.Schema({
    
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
    institute_name: {
        type: String
    },
    website_url: {
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



const School = mongoose.model('School', SchoolSchema);
module.exports = School;
