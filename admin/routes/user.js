const express = require('express');
const router = express.Router();
const superAdminAuthenticate = require('../../middleware/super_admin_authenticate');
const { user_list , delete_user } = require('../controllers/user');



router.get('/userList' , superAdminAuthenticate , user_list);
router.delete('/deleteUser' , superAdminAuthenticate , delete_user)


module.exports = router;


