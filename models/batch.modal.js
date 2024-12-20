
const mongoose = require('mongoose');


const batchSchema = new mongoose.Schema({

    batch_name: {
        type: String
    },
    course_name: {
        type: String
    },
    start_date: {
        type: String
    },
    end_date:{
        type:String,
    },
    batch_manager:{
       type:String
    },
    instructor_name:{
        type:String
    },
    duration:{
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


const Batch = mongoose.model('batch', batchSchema);
module.exports = Batch;
