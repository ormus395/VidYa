const express = require('express');
const router = express.Router();

//Index or Home route
router.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {title: title});
});

module.exports = router;