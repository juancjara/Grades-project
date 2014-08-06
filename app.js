var express = require('express'),
  session = require("express-session"),
  bodyParser = require('body-parser'),
  rCourse = require('./route/rCourse.js'),
  rUser = require('./route/rUser.js'),
  rApp = require('./route/rApp.js'),
  mongoose = require('mongoose'),
  path = require("path"),
  app = express();

mongoose.connect("mongodb://localhost/gradesDB");

function isAuthenticated(req, res, next) {
  req.session.userId = "53e1b8b4f2b5f8743dd46ded";
  next();
}

app.use(session({secret: 'ninho rata', saveUninitialized:true, resave:true}));
app.use( bodyParser.json()); 
app.use(express.static(path.join(__dirname, "public")));

app.get('/:id', function(req, res) {
  req.session.userId = req.params.id;
  res.send("ya"+req.session.userId);
});

app.post('/login', rApp.login);
app.post('/logout', rApp.logout);

app.post('/Course/search', isAuthenticated, rCourse.search);
app.post('/Course/create', isAuthenticated, rCourse.create);
app.post('/Course/read', isAuthenticated, rCourse.read);
app.post('/Course/del', isAuthenticated, rCourse.del);
app.post('/Course/update', isAuthenticated, rCourse.update);
app.post('/Course/getFormula', isAuthenticated, rCourse.getFormula);
app.post('/Course/add', isAuthenticated, rCourse.add);
app.post('/Course/share', isAuthenticated, rCourse.share)

app.post('/User/add', rUser.add);
app.post('/User/getCourses', isAuthenticated, rUser.getCourses);

app.listen(process.env.PORT || 8765);
console.log("Express server listening on port 8765");