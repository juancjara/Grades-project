var mongoose = require('mongoose'),
    User = require('./../models/user.js'),
    Course = require('./../models/course.js'),
    Semester = require('./../models/semester.js');

exports.getList = function(req,res){
    var userId = req.session.userId;

    Semester.getSemesterAndCourse(userId,
        function(err,model){
        if ( err ) res.send({err:console.log(err)});
        console.log("getSemesters",model);
        res.send(model);
    });
}
exports.add = function(req,res){
    var userId = req.session.userId;

    Semester.add( { name: req.body.name , userId : userId } , function(err,model){
        if ( err ) res.send({msg: err});
        res.send(model);
    });
}

exports.update = function(req,res){
    Semester.findByIdAndUpdate( req.body.id , {name:req.body.name} , {lean:true},
        function(err,model){
            if(err) res.send({err:console.log(err)})
            console.log("ok");
            res.send(model);
        } 
    );

}

exports.del = function(req,res){
    var userId = req.session.userId    
    
    Semester.del( {userId : userId , idSem: req.body.id} ,
        function(err){
        if( err ) res.send({ msg: console.log(err) });
        res.send({msg:"done"});
    });

}