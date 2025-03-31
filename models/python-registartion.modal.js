

const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({

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


const Events =  mongoose.model('event', eventSchema);
module.exports = Events;
