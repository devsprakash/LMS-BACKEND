const mongoose = require('mongoose');


const OrderSummarySchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    total_amount:{
        type:Number
    },
    order_id:{
        type: String
    },
    payment_status: {
        type: String,
        default: 'pending', // Default status as pending
        enum: ['pending', 'paid', 'failed'] // Accepted values
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


const OrderSummary = mongoose.model('OrderSummary', OrderSummarySchema);
module.exports = OrderSummary;
