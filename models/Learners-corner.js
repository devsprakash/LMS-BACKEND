const mongoose = require('mongoose');


// Define user schema
const LearnerSchema = new mongoose.Schema({
    
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



const Learner = mongoose.model('learner', LearnerSchema);
module.exports = Learner;
