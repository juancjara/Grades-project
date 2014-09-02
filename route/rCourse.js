var mongoose = require('mongoose'),  
  Course = require('./../models/course.js');

exports.add = function(req, res) {
  Course.add({userId: req.user._id, id: req.body.id},
    function(err,model) {
      if ( err) res.send({msg: err});
      res.send(model);
  });
}

exports.create = function(req, res) {
  var userId = req.user._id;
  Course.create({name: req.body.name, userId: userId},
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
  var params = {
    courseId: req.body.id,
    userId: req.user._id
  };
  console.log(params);
  Course.share(params, function(err) {
    if (err) res.send({msg: console.log(err)});
    res.send({msg: "OK"});
  });
}

exports.del = function(req, res){
  Course.del({id: req.body.id, userId: req.user._id},
    function(err) {
      if (err) res.send({msg: console.log(err)});
      res.send({msg: "OK"});
    });
}

exports.update = function(req, res){
  var newData = {};
  if (req.body.name) {
    newData.name = req.body.name;
  }
  if (req.body.formula) {
    newData.formula = req.body.formula;
  }
  newData.baseFormula = '';
  if (req.body.baseFormula) {
    newData.baseFormula = req.body.baseFormula;
  }
  Course.findByIdAndUpdate(req.body.id, newData,
    function(err) {
      if (err) res.send({msg: console.log(err)});
      res.send({msg: "OK"});
    }
  );
}

exports.getFormula = function(req, res) {
  getData(req.body.id, {formula: 1, baseFormula: 1, name: 1}, res);
}

exports.search = function(req, res) {
  Course.search(req.body.name, function(err, courses){
    if (err) res.send({msg: console.log(err)});
    res.send(courses);
  });
}