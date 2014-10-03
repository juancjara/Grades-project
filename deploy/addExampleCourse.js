var mongoose = require('mongoose');
var User = require('./../models/user');
var Course = require('./../models/course');

function addBaseCourseToAll(connectionString, cb) {
  mongoose.connect(connectionString);
  var exampleCourse = new Course({
    user: '11e42af15f9b16oo1a4a80f8',
    name: 'curso ejemplo',
    searchValue: 'curso ejemplo',
    formula: '{"bounds":{"lower":0,"upper":20},"decimals":2,"deleteMin":0,"isEditable":false,"label":"Pro","trunk":0,"weight":1,"children":[{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":1,"isEditable":true,"label":"Pa","trunk":1,"weight":3,"children":[{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"label","trunk":1,"weight":1,"children":[],"lock":true},{"bounds":{"upper":20,"lower":0},"label":"label","children":[],"decimals":2,"deleteMin":0,"isEditable":true,"trunk":0,"weight":1,"lock":true},{"bounds":{"upper":20,"lower":0},"label":"label","children":[],"decimals":2,"deleteMin":0,"isEditable":true,"trunk":0,"weight":1},{"bounds":{"upper":20,"lower":0},"label":"label","children":[],"decimals":2,"deleteMin":0,"isEditable":true,"trunk":0,"weight":1},{"bounds":{"upper":20,"lower":0},"label":"label","children":[],"decimals":2,"deleteMin":0,"isEditable":true,"trunk":0,"weight":1,"lock":false}]},{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"Ex1","trunk":1,"weight":3,"children":[{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"label","trunk":1,"weight":1,"children":[]}]},{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"Ex2","trunk":1,"weight":4,"children":[{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"label","trunk":1,"weight":1,"children":[]}]}]}',
    baseFormula: '(3Pa+ 3Ex1 + 4 Ex2) /10',
    votes: -9999
  });
  exampleCourse.save(function(err) {
    if (err) return cb(err);
    User.find({}, function(err, users) {
      console.log(users.length);
      for (var i = 0; i < users.length; i++) {
        Course.add(
          {
            userId: users[i]._id,
            id: '11e42af15f9b16oo1a4a80f8'
          }, function(err, model) {
            if (err) return cb(err);
            console.log('ok');
          }
        );
      
      };
    });  
  });
  
}

addBaseCourseToAll('mongodb://localhost/gradesDB', function(err, msg) {
    if(err) console.log("init addNewCourse",err);
    console.log(msg);
});