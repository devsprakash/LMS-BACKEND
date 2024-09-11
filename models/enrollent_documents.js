


const mongoose = require('mongoose');


// Define user schema
const EnrollDocumentsSchema = new mongoose.Schema({

    tenth_certificate: {
        type: String
    },
    plus_two_certificate: {
        type: String
    },
    graduation_ertificate: {
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


const EnrollDocuments = mongoose.model('EnrollDocuments', EnrollDocumentsSchema);
module.exports = EnrollDocuments;
