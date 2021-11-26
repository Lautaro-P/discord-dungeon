const fs = require('fs')
const {Items} = require('../items/Items')

if(!fs.existsSync('./discord-dungeon')) {
    fs.mkdirSync('./discord-dungeon')
}

if(!fs.existsSync('./discord-dungeon/enemies')) {
    fs.mkdirSync('./discord-dungeon/enemies')
}

const enemies = fs.readdirSync('./discord-dungeon/enemies')
let ids = []
let names = []

for (const _enemy of enemies) {
    const enemy = JSON.parse(fs.readFileSync(`./discord-dungeon/enemies/${_enemy}`, "utf8"))
    if (!enemy.id || isNaN(enemy.id) || Number(enemy.id) <= -1 || !Number.isInteger(Number(enemy.id))) {
        const err = new Error(`Invalid enemy id. ${_enemy}`)
        throw err;
    }
    if (!enemy.name || typeof enemy.name !== 'string' || enemy.name.length > 20) {
        const err = new Error(`Invalid enemy name. ${_enemy}`)
        throw err;
    }
    if (!enemy.health || isNaN(enemy.health) || Number(enemy.health) <= 0) {
        const err = new Error(`Invalid enemy health. ${_enemy}`)
        throw err;
    }
    if (!enemy.zone || typeof enemy.zone !== 'string' || enemy.zone.length > 20) {
        const err = new Error(`Invalid enemy zone. ${_enemy}`)
        throw err;
    }
    if (!enemy.stage || isNaN(enemy.stage) || Number(enemy.stage) <= 0 || !Number.isInteger(Number(enemy.stage))) {
        const err = new Error(`Invalid enemy stage. ${_enemy}`)
        throw err;
    }
    if (!enemy.damage || isNaN(enemy.damage) || Number(enemy.damage) <= 0) {
        const err = new Error(`Invalid enemy damage. ${_enemy}`)
        throw err;
    }
    if (!enemy.armor || isNaN(enemy.armor) || Number(enemy.armor) <= 0) {
        const err = new Error(`Invalid enemy armor. ${_enemy}`)
        throw err;
    }
    if (enemy.money) {
        if (Array.isArray(enemy.money)) {
            if (!enemy.money[0] || !enemy.money[1] || isNaN(enemy.money[0]) || isNaN(enemy.money[1]) || Number(enemy.money[0]) < 1 || Number(enemy.money[0]) >= Number(enemy.money[1])) {
                const err = new Error(`Invalid enemy money drop range. ${_enemy}`)
                throw err;
            }
        }
        else {
            if (isNaN(enemy.money) || Number(enemy.money) < 1) {
                const err = new Error(`Invalid enemy money drop. ${_enemy}`)
                throw err;
            }
        }
    }
    if (enemy.xp) {
        if (Array.isArray(enemy.xp)) {
            if (!enemy.xp[0] || !enemy.xp[1] || isNaN(enemy.xp[0]) || isNaN(enemy.xp[1]) || Number(enemy.xp[0]) < 1 || Number(enemy.xp[0]) >= Number(enemy.xp[1])) {
                const err = new Error(`Invalid enemy xp drop range. ${_enemy}`)
                throw err;
            }
        }
        else {
            if (isNaN(enemy.xp) || Number(enemy.xp) < 1) {
                const err = new Error(`Invalid enemy xp drop. ${_enemy}`)
                throw err;
            }
        }
    }
    if (!['common', 'uncommon', 'special', 'rare', 'very_rare', 'mythical'].includes(enemy.rarity)) {
        const err = new Error(`Invalid enemy rarity. ${_enemy}`)
        throw err;
    }
    if (enemy.drop) {
        for (const key in enemy.drop) {
            if (isNaN(key) || Number(key) <= 0 || Number(key) > 100) {
                const err = new Error(`Invalid enemy drop percentage. ${_enemy}`)
                throw err;
            }
            for (const id in enemy.drop[`${key}`]) {
                if (!Items.GetItemWithID(parseInt(id))) {
                    const err = new Error(`Invalid enemy item drop id. ${_enemy}`)
                    throw err;
                }
                if (Array.isArray(enemy.drop[`${key}`][`${id}`])) {
                    if (!enemy.drop[`${key}`][`${id}`][0] || !enemy.drop[`${key}`][`${id}`][1] || isNaN(enemy.drop[`${key}`][`${id}`][0]) || isNaN(enemy.drop[`${key}`][`${id}`][1]) || Number(enemy.drop[`${key}`][`${id}`][0]) < 1 || Number(enemy.drop[`${key}`][`${id}`][0]) >= Number(enemy.drop[`${key}`][`${id}`][1])) {
                        const err = new Error(`Invalid enemy item drop amount range. ${_enemy}`)
                        throw err;
                    }
                }
                else {
                    if (isNaN(enemy.drop[`${key}`][`${id}`]) || Number(enemy.drop[`${key}`][`${id}`]) < 1) {
                        const err = new Error(`Invalid enemy item drop amount. ${_enemy}`)
                        throw err;
                    }
                }
            }
        }
    }
    ids.push(enemy.id)
    names.push(enemy.name)
}

let findDuplicates = arr => arr.filter((enemy, index) => arr.indexOf(enemy) != index)

findDuplicates(ids).forEach(id => {
    for (const _enemy of enemies) {
        const enemy = JSON.parse(fs.readFileSync(`./discord-dungeon/enemies/${_enemy}`, "utf8"))
        if (enemy.id === parseInt(id)) {
            const err = new Error(`Duplicated enemy id. ${_enemy}`)
            throw err;
        }
    }
});

findDuplicates(names).forEach(name => {
    for (const _enemy of enemies) {
        const enemy = JSON.parse(fs.readFileSync(`./discord-dungeon/enemies/${_enemy}`, "utf8"))
        if (enemy.name.toLowerCase() === name.toLowerCase()) {
            const err = new Error(`Duplicated enemy name. ${_enemy}`)
            throw err;
        }
    }
});

class Enemy {
    constructor(data = {}){

        this.id = data.id
        this.name = data.name
        this.health = data.health
        this.damage = data.damage
        this.armor = data.armor
        this.money = data.money
        this.xp = data.xp
        this.rarity = data.rarity
        this.drop = data.drop
    }

    GetRandomDrop() {
        const random = Math.random() * 101
        let drop = []
        for (const key in this.drop) {
            if (Number(key) >= random) {
                for (const id in this.drop[`${key}`]) {
                    if (Array.isArray(this.drop[`${key}`][`${id}`])) {
                        const item = Items.GetItemWithID(id)
                        const amount = Math.floor(Math.random() * (this.drop[`${key}`][`${id}`][1] - this.drop[`${key}`][`${id}`][0] + 1)) + this.drop[`${key}`][`${id}`][0]
                        drop.push({Item: item, amount: amount})
                    }
                }
            }
        }
        return drop
    }
}


class Enemies {
    
    /**
     * Get the enemy by ID
     * @param {number} enemyid Enemy ID
     * @param {boolean} [force] 
     * @returns {(Enemy|false)} Returns {@link Enemy}
     * if not found returns false
     */
    static GetEnemyWithID(enemyid, force = true) {
        if (!force) {
            if(isNaN(enemyid) || Number(enemyid) < 0) {
                return new Error("Invalid enemy id")
            }
        }
        const enemies = fs.readdirSync('./discord-dungeon/enemies')

        for (const _enemy of enemies) {
            const enemy = JSON.parse(fs.readFileSync(`./discord-dungeon/enemies/${_enemy}`, "utf8"))
            if (enemy.id === parseInt(enemyid)) return new Enemy(enemy)
        }

        return false
    }

    /**
     * Get the enemy by name
     * @param {string} enemyname Enemy name
     * @param {boolean} [force] 
     * @returns {(Enemy|false)} Returns {@link Enemy}
     * if not found returns false
     */
    static GetEnemyWithName(enemyname, force = true) {
        if (!force) {
            if(!typeof enemyname === 'string' || !enemyname || enemyname === "") {
                throw new Error("Invalid enemy name")
            }
        }
        const enemies = fs.readdirSync('./discord-dungeon/enemies')

        for (const _enemy of enemies) {
            const enemy = JSON.parse(fs.readFileSync(`./discord-dungeon/enemies/${_enemy}`, "utf8"))
            if (enemy.name.toLowerCase() === enemyname.toLowerCase()) return new Enemy(enemy)
        }

        return false
    }

    /**
     * Get random enemy by zone and stage
     * @param {string} zone Zone
     * @param {number} stage Stage
     * @returns {(Enemy)} Returns {@link Enemy}
     */
    static GetRandomEnemy(zone, stage) {
        if (!zone || typeof zone !== 'string') {
            const err = new Error('Invalid zone.')
            return err;
        }
        if (!stage || isNaN(stage) || Number(stage) < 1 || !Number.isInteger(Number(stage))) {
            const err = new Error('Invalid stage.')
            return err;
        }
        const enemiesDir = fs.readdirSync('./discord-dungeon/enemies')
        let enemies = []
        for (const _enemy of enemiesDir) {
            const enemy = JSON.parse(fs.readFileSync(`./discord-dungeon/enemies/${_enemy}`, "utf8"))
            enemies.push(enemy)
        }
        enemies = enemies.filter(enemy => enemy.zone === zone)

        if (!enemies[0]) {
            const err = new Error(`Not found enemy with zone ${zone}`)
            return err;
        }
        else {
            let rarity = {
                'common': 100, 
                'uncommon': 60, 
                'special': 30, 
                'rare': 12, 
                'very_rare': 6, 
                'mythical': 2
            }
            const random = Math.round(Math.random() * 100)

            enemies = enemies.filter(enemy => enemy.stage <= stage)
            if (!enemies[0]) {
                const err = new Error(`Not found enemy with stage ${stage}`)
                return err;
            }
            enemies = enemies.filter(enemy => rarity[enemy.rarity] >= random)
            console.log(random)
            const randomEnemy = enemies[Math.floor(Math.random()*enemies.length)]
            return new Enemy(randomEnemy)
        }
    }
}

module.exports = { Enemies }