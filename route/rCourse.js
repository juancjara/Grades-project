var mongoose = require('mongoose'),  
  Course = require('./../models/course.js');

exports.add = function(req, res) {
  Course.add({userId: req.session.userId, id: req.body.id},
    function(err,model) {
      if ( err) res.send({msg: err});
      res.send(model);
  });
}

exports.create = function(req, res) {
  var userId = req.session.userId;
  Course.create({name: req.body.name, formula: req.body.formula, userId: userId},
    function(err, course) {
      if (err) res.send({msg: console.log(err)});
      res.send(course);
  });
}

var getData = function(id, select, res) {
  Course.findById(id, select, 
    function(err, course) {
      if (err) res.send({msg: console.log(err)});
      course = course || {};
      res.send(course);
  });
}

exports.read = function(req, res) {
  getData(req.body.id, {__v: 0}, res);
}

exports.share = function(req, res) {
  Course.share(req.body.id, function(err) {
    if (err) res.send({msg: console.log(err)});
    res.send({msg: "OK"});
  });
}

exports.del = function(req,res){
  Course.del({id: req.body.id, userId: req.session.userId},
    function(err) {
      if (err) res.send({msg: console.log(err)});
      res.send({msg: "OK"});
    });
}

exports.update = function(req,res){
  Course.findByIdAndUpdate(req.body.id, req.body,
    function(err) {
      if (err) res.send({msg: console.log(err)});
      res.send({msg: "OK"});
    }
  );
}

exports.getFormula = function(req,res) {
  getData(req.body.id, {formula: 1, _id: 0}, res);
}