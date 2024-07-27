const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const { user_validator, login_validator, ValidatorResult, generate_new_auth_token_validator } = require('../../validation/user.validator')
const {
  Register
} = require('../controllers/user.controller')



router.post('/addUser', user_validator, ValidatorResult, authenticate, Register)




module.exports = router;
