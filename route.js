var mongoose = require('mongoose'),
    User = require('./models/user.js'),
    Course = require('./models/course.js'),
    Semester = require('./models/semester.js');

exports.getSemesters = function(req,res) {
    Semester.getSemesterAndCourse("53d9927ba36b85dc31db49ff",
        function(err,model){
        if ( err ) res.send({err:console.log(err)});
        console.log("pop",model);
        res.send(model);
    });
}
exports.getCourseFormula = function(req,res) {
    var courseId = 4;
    //res.send( logic.getCourseFormula( courseId ) );
}
save = function(model,res){
    model.save(function(err){
        if ( err) res.send( console.log(err) );
        res.send(model);
    });
}

exports.saveCourse = function(req,res){
    console.log("saveCourse",req.body);
    var course = new Course({name: req.body.name , abr : req.body.abr , code : req.body.code , formula : req.body.formula});

    course.save(function(err){
            if ( err ) res.send (console.log(err) );
            console.log("save",course);
            Semester.update(
                {"name": req.body.ciclo },
                {$push: { courses: { data:"1+1=3" , course: course._id } }  },
                function(err){
                    if(err) res.send(console.log(err));
                    res.send({"val":"OK"});
                }
            );
            //res.send(course);
        }
    );
}
exports.shareCourse = function(req,res){
    res.send({"val":"TODO"});
}
exports.addUser = function(req,res){
    var user = new User( { name:req.body.name } );
    save(user,res);
}
exports.addSemester = function(req,res){
    
    var userId = mongoose.Types.ObjectId("53d9927ba36b85dc31db49ff");
    var model = new Semester({name:req.body.name, user : userId});
    model.save(function(err){
        console.log("model",model);
        User.update({_id:userId}, 
                    {$push: {semesters : model._id} },
                    function(err){ if(err) res.send(console.log(err));
                        res.send("OK");
                    });
    }); 
}