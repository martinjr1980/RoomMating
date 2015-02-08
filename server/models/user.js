var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  email_address:  String,
  password:  String,
  location: String,
  budget: Number,
  consc: Number,
  excite: Number,
  self: Number,
  created_at: Date
});

module.exports = mongoose.model('User', UserSchema);