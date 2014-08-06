var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var userSchema = new Schema({
  name: String,
  courses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
});

userSchema.statics.getCourses = function(params, cb) {
  User.find({_id: userId }, {}).populate("courses").exec(cb);
}

userSchema.statics.addCourse = function(params, cb){
  User.findByIdAndUpdate(params.userId, {$push: {courses: params.id}}, cb);
}

userSchema.statics.delCourse = function(params, cb){
  User.findOne({_id: params.userId},
    function(err, user) {
      if (err) return cb(err);
      var idx = user.courses.indexOf(params.id);
      user.courses.splice(idx, 1);
      user.save(cb);
  });
}
var User = module.exports = mongoose.model('User', userSchema);