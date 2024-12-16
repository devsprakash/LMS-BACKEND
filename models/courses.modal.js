
const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({

    course_name: {
        type: String
    },
    course_duration: {
        type: String
    },
    course_image: {
        type: String
    },
    isPublished:{
        type:String,
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


const Course = mongoose.model('course', courseSchema);
module.exports = Course;
