

const mongoose = require('mongoose');


const DocumentUploadSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    application_fee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApplicationFees', 
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
    total_fees:{
        type: Number
    },
    payment_status:{
        type:String,
        default:'paid'
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
