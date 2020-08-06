var express = require('express');
var router = express.Router();

var gameModel = require('../models/game')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/saveGrid', async function(req, res, next) {

  var game = null

  if(req.body.id != ''){

    var game = await gameModel.findById(req.body.id)
  }

  
  var newGrid = JSON.parse(req.body.grid)

  if(game == null){
    game = new gameModel({
      name : "Game1",
    });
  }

  game.grid.shift()

  game.grid.push(newGrid);
   
  var gameSaved = await game.save();

  res.json({ id: gameSaved.id });
});

router.get('/getGrid', async function(req, res, next) {


  var game = await gameModel.findOne()

  res.json({ grid: game.grid[0] });
});

module.exports = router;
