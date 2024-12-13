const express = require('express');
const router = express.Router();
const superAdminAuthenticate = require('../../middleware/super_admin_authenticate');
const { addCourse, CourseList, editCourse, deleteCourse, editStatus } = require('../controllers/courses.controller');
const {add_course_validator , courseId_validator , ValidatorResult} = require('../../validation/course.validator');
const upload = require('../../middleware/multer')



router.post('/addcourse', upload.single('course_image') , add_course_validator , ValidatorResult , superAdminAuthenticate , addCourse)
router.get('/courseList' , superAdminAuthenticate , CourseList);
router.put('/editCourse' , courseId_validator , ValidatorResult , superAdminAuthenticate , editCourse);
router.delete('/deleteCourse' , courseId_validator , ValidatorResult , superAdminAuthenticate , deleteCourse);
router.patch('/editStatus' , courseId_validator , ValidatorResult , superAdminAuthenticate , editStatus)




module.exports = router;