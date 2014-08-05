var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var courseSchema = new Schema({
    name:  String,
    abr : String,
    code : String,
    formula : String,//Schema.Types.Mixed
    shared : {type: Boolean, default:false}
});
 
courseSchema.statics.addCourse = function(params,cb) {
    var course = new Course({ 
        name: params.name,
        abr : params.abr, 
        code: params.code,
        formula : params.formula
    } );
    course.save(function(err){
        if( err ) {
            return cb(err);
        }
        mongoose.model('Semester').update(
            {"_id":params.idSem},
            { $push: { courses: { data:"1+1=3" , course: course._id } }  },
            function(err){
                if ( err ){
                    return cb(err);
                }
                return cb(null,course);
            });
    });
}

courseSchema.statics.del = function(params,cb){
    mongoose.model('Semester')
    .findOne({_id: params.idSem})
    .populate("courses.course")
    .exec(function(err,model){
        var idx = 0;
        for( var i = 0; i < model.courses.length ; i++){
            if ( params.id == model.courses[i].course._id ){
                idx = i;
                break;
            }
        }
        model.courses.splice(idx,1);
        model.save(function(err){
            if( err ) return cb(err);
            Course.findByIdAndRemove(params.id,
                function(err){
                    if( err ) return cb(err);
                    return cb(null);
                }
            );
        });
    });
}

var Course = module.exports = mongoose.model('Course', courseSchema);