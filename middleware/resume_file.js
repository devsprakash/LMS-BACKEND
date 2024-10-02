const multer = require('multer');

// Set up storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Save files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save the file with the original name
  }
});

// File filter to accept only PDF and Word documents
const fileFilter = function (req, file, cb) {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false); // Reject the file
  }
};

// Set up Multer with storage and fileFilter
const ResumeUpload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = ResumeUpload;
