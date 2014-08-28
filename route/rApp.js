var mongoose = require('mongoose');
var Contact = require('./../models/contact.js');

exports.login = function(req, res) {
  res.render('login');
};

exports.index = function(req, res) {
  res.render('grades');
};

exports.about = function(req, res) {
  res.render('about');
};

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
};

exports.error404 = function(req, res){
  res.render('404');
};

exports.help = function(req, res){
  res.render('help');
};

exports.contact = function(req, res) {
  var contact = new Contact(req.body);
  contact.save(function(err,model) {
    if(err) return res.senc({msg: console.log(err)});
    model = model || {};
    res.send(model);
  }); 
};