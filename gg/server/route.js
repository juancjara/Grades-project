var logic = require('./logic.js')

exports.getSemesters = function(req,res) {
    console.log("route");
    var userId = 5;
    res.send( logic.getSemesterInfo( userId ) );
}