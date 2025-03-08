const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({

    promoCode: {
        type: String
    },
    discountType: {
        type: String,
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    maxUsage: {
        type: Number,
        default: 1
    },
    usageCount: {
        type: Number,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: String,
    },
    updatedAt: {
        type: String,
    },
    deletedAt: {
        type: String,
        default: null // Set when the record is soft-deleted
    }
});


const promoCode = mongoose.model('promoCode', promoCodeSchema);
module.exports = promoCode;
