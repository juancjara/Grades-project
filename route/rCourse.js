var mongoose = require('mongoose'),
    User = require('./../models/user.js'),
    Course = require('./../models/course.js'),
    Semester = require('./../models/semester.js');

exports.add = function(req,res){
    Course.addCourse(req.body, function(err,model){
        if( err ) res.send({msg: err});
        res.send(model);
    });
}

exports.share = function(req,res){
    Course.findByIdAndUpdate( req.body.id , {shared:true}, {lean:true} ,
        function(err,model){
            if(err) res.send({err:console.log(err)})
            console.log("ok");
            res.send(model);
        }
    );
}

exports.del = function(req,res){
    Course.del({idSem:req.body.idSem, id: req.body.id },
        function(err){
            if( err ) res.send({msg: console.log(err)});
            res.send({msg:"done"});
        }
    );
}

exports.update = function(req,res){

}

exports.getFormula = function(req,res){

}