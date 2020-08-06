var mongoose = require('mongoose');

var GridSchema = mongoose.Schema({
    userName : String,
    '1': Number,
    '2': Number,
    '3': Number,
    '4': Number,
    '5': Number,
    '6': Number,
    total1: Number,
    bonus: Number,
    total1b: Number,
    min: Number,
    max: Number,
    total2: Number,
    brelan: Number,
    psuite: Number,
    gsuite: Number,
    full: Number,
    carre: Number,
    yams: Number,
    chance: Number,
    total3: Number,
    total: Number,
   });

var GameSchema = mongoose.Schema({
    name : String,
    grid: [GridSchema],
   });

module.exports = mongoose.model('games', GameSchema);
