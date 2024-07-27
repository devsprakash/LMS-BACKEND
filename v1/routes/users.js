const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const { user_validator, login_validator, ValidatorResult, generate_new_auth_token_validator } = require('../../validation/user.validator')
const {
  login,
  logout,
  generate_auth_tokens,
  addUser
} = require('../controllers/user.controller')



router.post('/addUser', user_validator, ValidatorResult, authenticate, addUser)
router.post('/login', login_validator, ValidatorResult, login)
router.get('/logout', authenticate, logout)
router.post('/generate_new_tokens', generate_new_auth_token_validator, ValidatorResult, generate_auth_tokens)




module.exports = router;
