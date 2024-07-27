const express = require('express');
const router = express.Router();
const { login_validator } = require('../../validation/user.validator')
const {
  login,
  logout
} = require('../controllers/admin.controller');
const authenticate = require('../../middleware/authenticate');



router.post('/login', login_validator, login)
router.get('/logout', authenticate, logout)




module.exports = router;


