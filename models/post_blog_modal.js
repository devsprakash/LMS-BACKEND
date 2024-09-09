
const mongoose = require('mongoose');


// Define user schema
const BlogSchema = new mongoose.Schema({

    blog_name: {
        type: String
    },
    blog_title: {
        type: String
    },
    blog_image: {
        type: String
    },
    blog_category:{
        type:String
    },
    blog_content:{
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



const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
