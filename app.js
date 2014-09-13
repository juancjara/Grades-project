var express = require('express'),
  session = require("express-session"),
  bodyParser = require('body-parser'),
  rCourse = require('./route/rCourse.js'),
  rUser = require('./route/rUser.js'),
  rApp = require('./route/rApp.js'),
  mongoose = require('mongoose'),
  path = require("path"),
  app = express(),
  passport = require('passport'),
  config = require('./config.js');

require('./passport.js')(passport);

mongoose.connect(config.db.connectionString);

function isAuthenticated(req, res, next) {
  if(process.env.NODE_ENV == 'dev'){
    req.user = {_id: '11e42af15f9b16241a4a80f8'}; 
  }
  if( req.user ) {
    return next();
  }
  res.redirect('/');
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(session({secret: config.session.secret, saveUninitialized: true, resave: true}));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

var redirect_url = {
  successRedirect: '/index',
  failureRedirect: '/' 
}

app.get('/index', isAuthenticated, rApp.index);
app.get('/about', isAuthenticated, rApp.about);
app.get('/help', isAuthenticated, rApp.help);
app.get('/', rApp.login);
app.get('/logout', rApp.logout);

app.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'] 
    })
);
app.get('/auth/google/callback',
  passport.authenticate('google', redirect_url));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', redirect_url));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', redirect_url));

app.post('/Course/search', isAuthenticated, rCourse.search);
app.post('/Course/create', isAuthenticated, rCourse.create);
app.post('/Course/read', isAuthenticated, rCourse.read);
app.post('/Course/del', isAuthenticated, rCourse.del);
app.post('/Course/update', isAuthenticated, rCourse.update);
app.post('/Course/getFormula', isAuthenticated, rCourse.getFormula);
app.post('/Course/add', isAuthenticated, rCourse.add);
app.post('/Course/share', isAuthenticated, rCourse.share)

app.post('/User/getCourses', isAuthenticated, rUser.getCourses);

app.post('/contact', rApp.contact);

app.get('*', rApp.error404);

//process.env.NODE_ENV = 'pro';

var port = process.env.PORT || 8765;

app.listen(port);
console.log("Environment " + process.env.NODE_ENV);
console.log("Express server listening on port " + port);
