var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var semesterSchema = new Schema({
    name:String,
    user : {type: Schema.Types.ObjectId, ref: 'User'},
    courses : [ 
        {
            data : String ,
            course : {  type: Schema.Types.ObjectId, ref: 'Course' } 
        }
    ]
});

semesterSchema.statics.getSemesterAndCourse = function(idUser,cb){
    this
    .find({ user:idUser},{ _id : 0})
    .populate("courses.course")
    .exec(cb);
};

semesterSchema.statics.del = function( params , cb ){
    mongoose.model('User').findOne({ _id : params.userId}, function(err, doc){
        if( err ) return cb(err);
        var idx = doc.semesters.indexOf( params.idSem );
        console.log(idx);
        doc.semesters.splice(idx, 1);
        doc.save(function(err){
            if( err )  return cb(err) ;
            mongoose.model('Semester').findByIdAndRemove( params.idSem , 
                function(err){
                    if( err ) return cb(err);
                    return cb(null);
                }
            );
        });
    });
}

semesterSchema.statics.add = function(params , cb){
    var model = new Semester({name:params.name, user : params.userId});

    model.save(function(err){
        if( err ) return cb(err);        
        mongoose.model('User').update({_id:params.userId}, 
            {$push: {semesters : model._id} },
            function(err){ if(err) return cb(err);
            return cb(null,model);
        });
    });
}

var Semester = module.exports = mongoose.model('Semester',semesterSchema);
