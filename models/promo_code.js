const mongoose = require('mongoose');


const promoCodeSchema = new mongoose.Schema({

    promo_code:{
        type:String
    },
    expire_days:{
        type:Date,
    },
    discount:{
        type:Number
    },
    isActive:{
        type:Boolean,
        default:true
    },
    discount_amount:{
        type:Number
    },
    total_amount:{
        type:Number,
        default:0
    },
    created_at: {
        type: String,
    },
    updated_at: {
        type: String,
    },
    deleted_at: {
        type: String,
        default: null // Set when the record is soft-deleted
    }
});


const promoCode = mongoose.model('promoCode', promoCodeSchema);
module.exports = promoCode;
