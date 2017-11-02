//Need to import express framework, and other libraries
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
//Optional import logger library
const morgan = require('morgan');
//Import view engine library
const exhbs = require('express-handlebars');

//Dev created libraries/ dependencies/ middleware/ routing ect...
require('./config/passport')(passport);
const database = require('./config/database'); //Database connection
const index = require('./routes/index'); //Index routing middleware import
const about = require('./routes/about'); //About routing middleware import
const ideas = require('./routes/ideas'); //Ideas routing middleware import
const users = require('./routes/users'); //Users routing middleware import

//Need to invoke the express middleware, this initializes the server side application
const app = express();

//after invoking the express method in a variable, you need to initialize a port for the server to listen on
const port = process.env.PORT || 3000;

//then call the listen method on our express app variable to allow port requests
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//Map global promise, to get rid of mongoose derpeciating mpromise warning
mongoose.Promise = global.Promise;
//Connect to mongoose database
mongoose.connect(database.mongURI, {
  useMongoClient: true
})
  .then(() => { 
    console.log('Connected to MongoDB'); 
  })
  .catch(err => console.log(err));

//Now invoke middleware

//Invoking logger middleware
app.use(morgan('dev'));

//View engine middleware
app.engine('handlebars', exhbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Invoke badyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

// method override mw, used to change form method
app.use(methodOverride('_method'))

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables for flash
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
/*
  Now that our server is listening for requests, we can initialize our endpoints,
  endpoints allow for http methods or requests(get, post, put, delete are the most common).
  Can handle each endpoint with defined methods, like res.send, res.json etc..
  Best practice is to put more complicated routes first
*/
//Invoking routing middleware
app.use('/ideas', ideas); //ideas endpoint
app.use('/about', about);//About endpoint
app.use('/users', users); //Users endpoints
app.use('/', index);//Index / home route

