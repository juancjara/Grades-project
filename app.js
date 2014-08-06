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

app.use(session({secret: 'ninho rata', saveUninitialized:true, resave:true}));
app.use( bodyParser.json()); 
app.use(express.static(path.join(__dirname, "public")));

app.get('/:id', function(req, res) {
  req.session.userId = req.params.id;
  res.send("ya"+req.session.userId);
});

app.post('/login', rApp.login);
app.post('/logout', rApp.logout);

app.post('/Course/create', rCourse.create);
app.post('/Course/read', rCourse.read);
app.post('/Course/del', rCourse.del);
app.post('/Course/update', rCourse.update);
app.post('/Course/getFormula', rCourse.getFormula);
app.post('/Course/add', rCourse.add);
app.post('/Course/share', rCourse.share)

app.post('/User/add', rUser.add);

app.listen(8765);
console.log("Express server listening on port 8765");