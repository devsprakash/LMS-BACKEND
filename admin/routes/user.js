const express = require('express');
const router = express.Router();
const superAdminAuthenticate = require('../../middleware/super_admin_authenticate');
const { user_list , delete_user ,  reset_passwords, user_status_updated } = require('../controllers/user');



router.get('/userList' , superAdminAuthenticate , user_list);
router.delete('/deleteUser' , superAdminAuthenticate , delete_user);
router.put('/resetPassword' , superAdminAuthenticate ,  reset_passwords);
router.put('/userStatusUpdated' , superAdminAuthenticate ,  user_status_updated);

module.exports = router;


