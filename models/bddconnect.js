var mongoose = require('mongoose');

var user = 'test';
var password = 'tT7bMMT8tVtHqdxJ';
var bddname = 'yams';

var options = { connectTimeoutMS: 5000, useNewUrlParser: true, useUnifiedTopology: true  }

mongoose.connect(
  "mongodb+srv://"+user+":"+password+"@cluster0-9xbpy.mongodb.net/"+bddname+"?retryWrites=true&w=majority", 
  options, 
  function(error){
    console.log(error)
  }
);