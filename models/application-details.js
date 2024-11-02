
const mongoose = require('mongoose');


// Define user schema
const ApplicationDeatilsSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    gender:{
        type:String
    },
    date_of_birth:{
        type:String
    },
    education:{
        type:String
    },
    experience:{
        type:Number
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


const ApplicationDeatils = mongoose.model('ApplicationDeatils', ApplicationDeatilsSchema);
module.exports = ApplicationDeatils;
