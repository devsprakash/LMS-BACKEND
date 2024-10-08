
const mongoose = require('mongoose');


const ApplySchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
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
    immediate_join:{
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


const Apply = mongoose.model('Apply', ApplySchema);
module.exports = Apply;
