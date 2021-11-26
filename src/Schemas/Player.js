const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    id: Number,
    money: {type: Number, default: 20},
    health: {type: Number, default: 100},
    health_max: {type: Number, default: 100},
    damage: {type: Number, default: 1},
    armor: {type: Number, default: 0},
    equipment: {
        helmet: {type: Number, default: -1},
        chestplate: {type: Number, default: -1},
        weapon: {type: Number, default: -1}
    },
    bag: {type: Object},
})

module.exports = mongoose.model('Player', Schema)