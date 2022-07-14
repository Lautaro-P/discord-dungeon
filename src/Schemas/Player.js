const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    id: {type: String},
    money: {type: Number, default: 20},
    xp: {type: Number, default: 0},
    level: {type: Number, default: 1},
    points: {type: Number, default: 0},
    class: {type: String},
    race: {type: String},
    skills: [{
        id: {type: Number},
        level: {type: Number}
    }],
    health: {type: Number, default: 100},
    health_max: {type: Number, default: 100},
    armor: {type: Number, default: 0},
    equipment: {
        helmet: {type: Number, default: -1},
        chestplate: {type: Number, default: -1},
        weapon: {type: Number, default: -1}
    },
    bag: {type: Object},
})

module.exports = mongoose.model('Player', Schema)