var mongoose = require('mongoose');
var Course = require('./../models/course');

update = function(connectionString, cb) {
  mongoose.connect(connectionString);
  Course.find({}, function(err, courses) {
  	if (err) cb(err);
    console.log(courses.length);
    for (var i = courses.length - 1; i >= 0; i--) {
      var actualCourse = courses[i];
      var id = actualCourse._id;
      var newData = {};
      newData.formula = addLockField(actualCourse.formula);
      Course.findByIdAndUpdate(id,newData,
        function(err) {
          if(err) return cb(err);
          console.log('ok');
        }
      );
    };
});
}

function addLockField(formula) {	
  if(!formula || formula.length==0) {
    return formula;
  }
  
  var eva = JSON.parse(formula);
  function addField(eva) {
    eva['lock'] = false;
    var children = eva.children;
    for (var i = 0; i < children.length; i++) {
      addField(children[i]);
    };
  }
  addField(eva);
  var newFormula = JSON.stringify(eva);
  return newFormula;
}

update('mongodb://localhost/gradesDB', function(err, msg) {
    if(err) console.log("init deploy db",err);
    console.log(msg);
});