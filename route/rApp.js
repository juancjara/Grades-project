exports.login = function(req, res) {
  res.render('login');
}

exports.index = function(req, res) {
  res.render('grades');
}

exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/login');
}