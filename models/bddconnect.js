var mongoose = require('mongoose');

var user = 'romane';
var password = 'roma04';
var bddname = 'yams';

var options = { connectTimeoutMS: 5000, useNewUrlParser: true, useUnifiedTopology: true  }

mongoose.connect(
  `mongodb+srv://${user}:${password}@cluster0.bu6a5.mongodb.net/${bddname}?retryWrites=true&w=majority`, 
  options, 
  function(error){
    console.log(error)
  }
);