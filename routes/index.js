var express = require('express');
var router = express.Router();
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");
var gameModel = require('../models/game')
var userModel = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', async function(req, res, next) {
  if(req.body.username != undefined && req.body.email != undefined && req.body.password != undefined){
    var user = await userModel.findOne({
      email: req.body.email
    });
    if(user != null){
      var result = false;
     }else{
      var salt = uid2(32);
      var token = uid2(32);
      var newUser = new userModel ({
        name: req.body.name,
        email: req.body.email,
        salt : salt,
        password: SHA256(req.body.password + salt).toString(encBase64),
        token: token
       });
       await newUser.save();
       var result = true;
     }
  }else{
    var result = false;
  }
  res.json({result, token});
});

router.post('/signin', async function(req, res, next) {
  if(req.body.email != undefined && req.body.password != undefined){
    var user = await userModel.findOne({
      email: req.body.email
     });
    if(user != null){
      var hash = SHA256(req.body.password + user.salt).toString(encBase64);
      if (hash === user.password) {
        var result = true;
        var token = user.token;
      } else {
        var result = false;
      }
    }else{
      var result = false;
    }
  }else{
    var result = false
  }
  res.json({result, token});
});

router.post('/saveGrid', async function(req, res, next) {

  var game = null

  if(req.body.id != ''){

    var game = await gameModel.findById(req.body.id)
  }

  
  var newGrid = JSON.parse(req.body.grid)

  if(game == null){
    game = new gameModel({
      name : req.body.name,
    });
  }

  game.grid[req.body.index] = newGrid;
   
  var gameSaved = await game.save();

  var user = await userModel.findOne({
    token: req.body.token, 
    games: {$all: [gameSaved._id]}
    });


  if(user == null){
    user = await userModel.updateOne(
      {token: req.body.token},
      {$push:{games: gameSaved._id}}
      );

  }

  res.json({ id: gameSaved.id });
});

router.post('/getGames', async function(req, res, next) {
  var user = await userModel.findOne({token: req.body.token});
  var games = [];
  for(let i=0; i<user.games.length; i++){
    var gameID =  await gameModel.findById(user.games[i]);
    if(gameID ){
      games.push(gameID);
    }
  }
  res.json(games);
});

router.post('/getPlayers', async function(req, res, next) {

  var game = await gameModel.findById(req.body.id)

  var players = [];
  for(let i=0; i<game.grid.length; i++){
    players.push(game.grid[i].userName)
  }
  res.json(players);
});

router.post('/getGrid', async function(req, res, next) {


  var game = await gameModel.findById(req.body.id)

  if(game.grid[req.body.index]){
  var grid = game.grid[req.body.index];
  }else{
  var grid = {
    1:null,
    2:null,
    3:null,
    4:null,
    5:null,
    6:null,
    total1:0,
    bonus:0,
    total1b:0,
    max:null,
    min:null,
    total2:0,
    brelan:null,
    psuite:null,
    gsuite:null,
    full:null,
    carre:null,
    yams:null,
    chance:null,
    total3:0,
    total:0

  }
  }

  res.json({ grid, name:game.name, game });
});

module.exports = router;
