
const mongoose = require('mongoose');


// Define user schema
const ApplicationDeatilsSchema = new mongoose.Schema({

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
    state:{
        type:String
    },
    location:{
        type:String
    },
    city:{
        type:String
    },
    gender:{
        type:String
    },
    date_of_birth:{
        type:String
    },
    highest_qualification:{
        type:String
    },
    specialization:{
        type:Number
    },
    institute_name:{
        type:String
    },
    passing_year:{
        type:String
    },
    working_professional:{
        type:String
    },
    work_experience:{
        type:Number
    },
    company_name:{
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


const ApplicationDeatils = mongoose.model('ApplicationDeatils', ApplicationDeatilsSchema);
module.exports = ApplicationDeatils;
