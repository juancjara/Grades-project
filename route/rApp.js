exports.login = function(req,res){
    req.session.userId = "53d9927ba36b85dc31db49ff";
    res.send("");
}

exports.logout = function(req,res){
    req.session.destroy();
    res.send("");
}