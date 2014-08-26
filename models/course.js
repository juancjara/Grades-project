var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var courseSchema = new Schema({
  name:  String,
  formula: String,
  shared: {type: Boolean, default: false},
  votes: Number
});

var cleanData = function(formula) {
  //TODO
  return formula;
  /*var bounds = {upper: 20, lower: 0};
  var eva = JSON.parse(formula);
  function clean(eva) {
    eva.bounds = bounds;
    var children = eva.children;
    for (var i = 0; i < children.length; i++) {
      clean(children[i]);
    };
  }
  return JSON.stringify(eva);*/
};

courseSchema.statics.share = function(id, cb) {
  Course.findById(id).exec( 
    function(err, course) {
      if (err) return cb(err);
      var baseFormula = cleanData();
      var clone = new Course({name: course.name, shared: true, formula: baseFormula, votes: 0});
      clone.save(cb);
    });
};


courseSchema.statics.add = function(params, cb) {
  Course.findById(params.id).exec(
    function(err, course){
      if (err) return cb(err);
      var votes = course.votes + 1;
      Course.findByIdAndUpdate(params.id, {votes: votes},
        function(err) {
          if (err) return cb(err);
          var clone = new Course({name: course.name, formula: course.formula});
          clone.save(function(err) {
            if (err) return cb(err);
            mongoose.model('User').addCourse({userId: params.userId, id: clone._id},
              function(err) {
                if (err) return cb(err);
                return cb(null, clone);
              });
          });
        }
      );
    }
  );
};

courseSchema.statics.create = function(params, cb) {
  var course = new Course(params);
  course.save(function(err) {
    if (err) return cb(err);
    mongoose.model('User').addCourse({userId: params.userId, id: course._id},
      function(err) {
        if (err) return cb(err);
        return cb(null, course);
      });
  });
};

courseSchema.statics.del = function(params, cb) {
  Course.findByIdAndRemove(params.id,
    function(err) {
      if (err) return cb(err);
      mongoose.model('User').delCourse(params, cb);  
  });
};

courseSchema.statics.addCourse = function(params,cb) {
  var course = new Course({ 
    name: params.name,
    abr : params.abr, 
    code: params.code,
    formula : params.formula
  } );
  course.save(
    function(err) {
      if( err ) {
          return cb(err);
      }
      mongoose.model('Semester').update(
        {"_id":params.idSem},
        {$push: {
          courses: {
            data:"1+1=3" ,
            course: course._id
          }
        }},
        function(err){
            if (err) {
              return cb(err);
            }
            return cb(null,course);
        });
  });
};

courseSchema.statics.search = function(nameParam, cb) {
  Course.find({
    name: new RegExp('^'+nameParam+'.*$', 'i'),
    shared: true
    }, {name: 1}, {sort: {votes: -1}}, cb);
};

var Course = module.exports = mongoose.model('Course', courseSchema);