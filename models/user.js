var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  Course = require('./course');

var userSchema = new Schema({
  provider_id: String,
  provider: String,
  name: String,
  courses: [{type: Schema.Types.ObjectId, ref: 'Course'}],
  createDate: { type: Date, default: Date.now },
  lastAccess: { type: Date, default: Date.now }
});

userSchema.statics.getCourses = function(userId, cb) {
  User.findOne({_id: userId }, {}).populate("courses","name").exec(cb);
};

userSchema.statics.addCourse = function(params, cb){
  User.findByIdAndUpdate(params.userId, {$push: {courses: params.id}}, cb);
};

userSchema.statics.delCourse = function(params, cb){
  User.findOne({_id: params.userId},
    function(err, user) {
      if (err) return cb(err);
      var idx = user.courses.indexOf(params.id);
      user.courses.splice(idx, 1);
      user.save(cb);
  });
};

userSchema.statics.findOrCreate = function(params, cb){
  User.findOne(params, function(err, user){
    if (err) return cb(err);
    if (user) {
      User.findByIdAndUpdate(user._id, 
        {lastAccess: Date.now()},
        function(err) {
          if (err) return cb(err);
          return cb(null, user);
      });

    } else {
      var newUser = new User(params);
      newUser.save(function(err) {
        if (err) return cb(err);
        Course.add(
          {
            userId: newUser._id,
            id: '11e42af15f9b16oo1a4a80f8'
          }, function(err, model) {
            if (err) return cb(err);
            return cb(null, newUser);
          }
        )
      });
    }
  });
};

var User = module.exports = mongoose.model('User', userSchema);