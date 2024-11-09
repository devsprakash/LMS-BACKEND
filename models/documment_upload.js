

const mongoose = require('mongoose');


const DocumentUploadSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    adharcard:{
        type:String
    },
    tenth_certificate: {
        type: String
    },
    plus_two_certificate:{
        type:String
    },
    order_id:{
       type:String
    },
    amount:{
        type: Number
    },
    payment_status:{
        type:String,
        default:'paid'
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


const DocumentUpload = mongoose.model('DocumentUpload', DocumentUploadSchema);
module.exports = DocumentUpload;
