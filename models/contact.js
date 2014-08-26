var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var contactSchema = new Schema({
  type:  String,
  title: String,
  msg: String,
  email: String
});

var Contact = module.exports = mongoose.model('Contact', contactSchema);