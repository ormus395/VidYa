const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/Users');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', (req, res) => {
  let errors = [];
  if(!req.body.password && !req.body.name && !req.body.email && !req.body.password2) {
    errors.push({text: 'Form is incomplete'});
  }
  if(req.body.password.length < 5) {
    errors.push({text: 'Password must be at least 5 characters long'});
  }
  if(req.body.password != req.body.password2) {
    errors.push({text: 'Passwords do not match'});
  } 
  if(errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
    });
  } else {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    let newUser = new User(user);
    User.addUser(newUser, (err, user) => {
      if(err) {
        errors.push({text: 'Failed to register account'});
        res.render('users/register', {
          errors: errors,
          name: req.body.name,
          email: req.body.email,
        });
      } else {
        req.flash('success_msg', 'Account Registered')
        res.render('ideas/add')
      }
    })
  }
})
module.exports = router;