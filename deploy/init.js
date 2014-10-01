var mongoose = require('mongoose');
var Course = require('./../models/course');
var User = require('./../models/user');

init = function(connectionString, cb) {
  mongoose.connect(connectionString);

  var user = new User({_id: '11e42af15f9b16oo1a4a80f8', name : "chibolo pulpin"});
  user.save(function(err) {
    if (err) return cb(err);
    var courseName = 'curso ejemplo';
    var userId = user._id;
    
    Course.create(
      {
        name: courseName,
        formula: '{"bounds":{"lower":0,"upper":20},"decimals":2,"deleteMin":0,"isEditable":false,"label":"Pro","trunk":0,"weight":1,"children":[{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":1,"isEditable":true,"label":"Pa","trunk":1,"weight":3,"children":[{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"label","trunk":1,"weight":1,"children":[]},{"bounds":{"upper":20,"lower":0},"label":"label","children":[],"decimals":2,"deleteMin":0,"isEditable":true,"trunk":0,"weight":1},{"bounds":{"upper":20,"lower":0},"label":"label","children":[],"decimals":2,"deleteMin":0,"isEditable":true,"trunk":0,"weight":1},{"bounds":{"upper":20,"lower":0},"label":"label","children":[],"decimals":2,"deleteMin":0,"isEditable":true,"trunk":0,"weight":1}]},{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"Ex1","trunk":1,"weight":3,"children":[{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"label","trunk":1,"weight":1,"children":[]}]},{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"Ex2","trunk":1,"weight":4,"children":[{"bounds":{"lower":0,"upper":20},"decimals":1,"deleteMin":0,"isEditable":true,"label":"label","trunk":1,"weight":1,"children":[]}]}]}',
        userId: userId,
        _id: '11e42af15f9b16oo1a4a80f8',
        votes: -999
      },
      function(err, course) {
        if (err) return cb(err);
        return cb(null, 'OK');
      });
    
  });
}

init('mongodb://localhost/gradesDB', function(err, msg) {
    if(err) console.log("init deploy db",err);
    console.log(msg);
});
