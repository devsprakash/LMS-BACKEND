
const mongoose = require('mongoose');


const ApplySchema = new mongoose.Schema({
    
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    position:{
        type:String
    },
    experience:{
        type:Number
    },
    resume:{
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


const Apply = mongoose.model('Apply', ApplySchema);
module.exports = Apply;
