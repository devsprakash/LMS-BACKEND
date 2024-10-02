

const mongoose = require('mongoose');


const CallbackSchema = new mongoose.Schema({

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


const Callback = mongoose.model('Callback', CallbackSchema);
module.exports = Callback;
