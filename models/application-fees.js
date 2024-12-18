


const mongoose = require('mongoose');


const ApplicationFeesSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    amount: {
        type: Number
    },
    order_id:{
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


const ApplicationFees = mongoose.model('ApplicationFees', ApplicationFeesSchema);
module.exports = ApplicationFees;
