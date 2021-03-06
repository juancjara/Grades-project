var mongoose = require('mongoose'),
  User = require('./../models/user.js');

exports.add = function(req, res) {
  var user = new User({name : req.body.name});
  user.save(function(err){
    if (err) res.send({"msg": console.log(err)});
    res.send(user);
  });
};

exports.getCourses = function(req, res) {
  User.getCourses(req.user._id, function(err, doc) {
    if (err) res.send({"msg": console.log(err)});
    res.send(doc);
  });
};