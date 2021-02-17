var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
   username : String,
   email: String,
   salt: String,
   password: String,
   token:String,
   games: [{type: mongoose.Schema.Types.ObjectId, ref: 'games'}]
  });

module.exports = mongoose.model('users', UserSchema);