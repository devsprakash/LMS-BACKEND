const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  addUsers,
  reset_password,
  forgot_password,
  change_role,
  admin_list,
  update_admin,
  delete_admin
} = require('../controllers/admin.controller');
const superAdminAuthenticate = require('../../middleware/super_admin_authenticate');
const adminAuthenticate = require('../../middleware/admin_authenticate');
const { admin_validator , delete_admin_validator , login_validator , update_admin_details_validator , reset_password_validator, chnage_role_validator , forgot_password_validator , ValidatorResult } = require('../../validation/admin.validator')




router.post('/addUsers' , admin_validator , ValidatorResult , addUsers);
router.post('/login', login_validator , ValidatorResult , login);
router.get('/logout', adminAuthenticate , logout);
router.post('/resetPassword', reset_password_validator , ValidatorResult, superAdminAuthenticate, reset_password)
router.post('/forgotPassword' , forgot_password_validator , ValidatorResult , forgot_password)
router.post('/change_role' , chnage_role_validator , ValidatorResult , superAdminAuthenticate , change_role )
router.get('/adminList' , superAdminAuthenticate , admin_list)
router.put('/update_admin_details' , update_admin_details_validator, ValidatorResult , superAdminAuthenticate , update_admin)
router.delete('/delete_admin', delete_admin_validator , ValidatorResult , superAdminAuthenticate , delete_admin)





module.exports = router;


