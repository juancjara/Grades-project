var mongoose = require('mongoose'),
  Course = require('./../models/course.js'),
  User = require('./../models/user.js');

exports.init = function(connectionString, cb) {
  mongoose.connect(connectionString);
  var user = new User({_id: '11e42af15f9b16241a4a80f8', name : "chibolo pulpin"});
  user.save(function(err) {
    if (err) return cb(err);
    
    var coursesNames = ['Fisica 1','Calculo 1','Quimica 1','Teología','Mate basicas'];
    var userId = user._id;
    for (var i = 0; i < coursesNames.length; i++) {
      Course.create({name: coursesNames[i], formula: '1+1=2', userId: userId},
        function(err, course) {
          if (err) return cb(err);
          Course.share(course._id, function(err) {
            if (err) return cb(err);
          })
        });
    }
  });
}