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
}

exports.contact = function(req, res) {

  console.log(req.body);
  res.send({});
};