const mongoose = require('mongoose');


// Define user schema
const DiscountFormSchema = new mongoose.Schema({

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
    city: {
        type:String,
    },
    adharacard:{
        type:Number,
    },
    pancard:{
        type:String,
    },
    ews_certificate:{
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



const DiscountForm = mongoose.model('Discount_Form', DiscountFormSchema);
module.exports = DiscountForm;
