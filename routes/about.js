const express = require('express');
const router = express.Router();

//Endpoint is /about, but endpoint is defined in routing middleware in server file
router.get('/', (req, res) => {
  res.render('about');
});

module.exports = router;