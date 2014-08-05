var express = require('express'),
    session = require("express-session"),
    bodyParser = require('body-parser'),
    route = require('./route.js'),
    rSemester = require('./route/rSemester.js'),
    rCourse = require('./route/rCourse.js'),
    rUser = require('./route/rUser.js'),
    rApp = require('./route/rApp.js'),
    mongoose = require('mongoose'),
    path = require("path"),
    app = express();

mongoose.connect("mongodb://localhost/gradesDB");

app.use(session({secret: 'ninho rata',saveUninitialized:true,resave:true}));
app.use( bodyParser.json()); 
app.use(express.static(path.join(__dirname, "public")));

app.get('/:id', function(req, res){
    console.log("gg");
  req.session.userId = req.params.id;
  res.send("ya"+req.session.userId);
});

app.post('/login',rApp.login);
app.post('/logout',rApp.logout);

app.post('/Semester/getList',rSemester.getList);
app.post('/Semester/add',rSemester.add);
app.post('/Semester/update',rSemester.update);
app.post('/Semester/del',rSemester.del);

app.post('/Course/add',rCourse.add);
app.post('/Course/share',rCourse.share)
app.post('/Course/del',rCourse.del)

app.post('/User/add',rUser.add);

app.post('/courseFormula',route.getCourseFormula);
app.post('/shareCourse',route.shareCourse);



app.listen(8765);
console.log("Express server listening on port 8765");