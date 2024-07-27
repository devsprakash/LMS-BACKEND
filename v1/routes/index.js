var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req , res) => {
  res.status(200).send({message:"Welcome To The Atiitglobal"})
});
module.exports = router;
