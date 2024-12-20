const express = require('express');
const router = express.Router();
const superAdminAuthenticate = require('../../middleware/super_admin_authenticate');
const { batch_validator , ValidatorResult } = require('../../validation/batch.validator');
const { addBatch, BatchList } = require('../controllers/batch.controller');


router.post('/addBatch' , batch_validator , ValidatorResult ,superAdminAuthenticate , addBatch);
router.get('/batchList' , superAdminAuthenticate , BatchList)



module.exports = router;