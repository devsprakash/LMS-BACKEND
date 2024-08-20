const express = require('express');
const router = express.Router();
const {
  login,
  logout
} = require('../controllers/admin.controller');
const authenticate = require('../../middleware/authenticate');



router.post('/login', login)
router.get('/logout', logout)




module.exports = router;


