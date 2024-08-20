

const mongoose = require('mongoose');


// Define user schema
const BrochureDownloadSchema = new mongoose.Schema({

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
});


const BrochureDownload = mongoose.model('BrochureDownload', BrochureDownloadSchema);
module.exports = BrochureDownload;
