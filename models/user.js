var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    name : String,
    semesters: [{ type: Schema.Types.ObjectId, ref: 'Semester' }]
});

module.exports = mongoose.model('User',userSchema);