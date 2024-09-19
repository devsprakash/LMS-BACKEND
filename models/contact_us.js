
const mongoose = require('mongoose');


const ContactSchema = new mongoose.Schema({

    full_name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    message:{
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


const Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
