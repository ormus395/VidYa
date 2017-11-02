const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

//Import model
const Ideas = require('../models/Idea');

router.get('/', ensureAuthenticated, (req, res) => {
  Ideas.find({user: req.user.id})
    .sort({date: 'descending'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

router.post('/', (req, res) => {
  console.log(req.body)
  let errors = [];
  if(!req.body.title) {
    errors.push({text: 'Please add a title'});
  }
  if(!req.body.details) {
    errors.push({text: 'Please add some detail'});
  }
  if(errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const idea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Ideas(idea).save()
      .then(idea => {
        req.flash('success_msg', 'Video Idea Added');
        res.redirect('/ideas');
      });
  }
});

router.put('/:id', (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //new values
    console.log(idea)
    idea.title = req.body.title || idea.title;
    idea.details = req.body.details;
    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Video Idea Updated');
        res.redirect('/ideas')
    });
  });
});

router.delete('/:id', (req, res) => {
  Ideas.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('success_msg', 'Video Idea Removed');
    res.redirect('/ideas')
  });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

//Get ideas by query param
router.get('/search', (req, res) => {
  Ideas.findOne({_id: req.query.id})
    .then(idea => {
      res.json(idea);
    });
});



router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

module.exports = router;