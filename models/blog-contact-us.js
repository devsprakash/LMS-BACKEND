

const mongoose = require('mongoose');


const BlogContactSchema = new mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
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


const BlogContact = mongoose.model('BlogContact', BlogContactSchema);
module.exports = BlogContact;
