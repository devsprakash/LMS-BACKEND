const mongoose = require('mongoose');


// Define user schema
const StorySchema = new mongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String
    },
    descripation: {
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



const Story = mongoose.model('story', StorySchema);
module.exports = Story;
