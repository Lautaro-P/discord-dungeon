const fs = require('fs')
const xlsx = require('xlsx')
const {Items} = require('../items/Items')

if(!fs.existsSync('./discord-dungeon')) {
    fs.mkdirSync('./discord-dungeon')
}

if(!fs.existsSync('./discord-dungeon/enemies.xlsx')) {
    const data = [{name:"Example", zone:"cave", stage: 1, health:10, damage:1, armor: 0, money:25, rarity: "common", drop: '{"100": {"1": "4,8"}, "50": {"2": "1,3"}}'},
    {name:"Example 2", zone:"cave", stage: 2, health:10, damage:1, armor: 0, money:"25,60", rarity: "common", drop: '{"100": {"1": "4,8"}, "50": {"2": "1,3"}}'}]

    const newWB = xlsx.utils.book_new()
    const newData = xlsx.utils.json_to_sheet(data)

    xlsx.utils.book_append_sheet(newWB, newData, "Enemies")
    xlsx.writeFile(newWB, './discord-dungeon/enemies.xlsx')
}

const wb = xlsx.readFile('./discord-dungeon/enemies.xlsx')
const ws = wb.Sheets["Enemies"]

let data = xlsx.utils.sheet_to_json(ws)

const enemies = data.map((_enemy, i) => {
    let enemy = _enemy
    enemy.id = i+1
    return enemy
})
let names = []

class Enemy {
    constructor(data = {}){

        this.id = data.id
        this.name = data.name.trim()
        this.zone = data.zone.trim()
        this.stage = data.stage
        this.health = data.health
        this.damage = data.damage
        this.armor = data.armor
        this.money = isNaN(data.money) ? data.money.split(",").map(Number)[1] ? data.money.split(",").map(Number) : Number(data.money) : Number(data.money)
        this.rarity = data.rarity
        if (data.drop !== "{}") {
            let drop = JSON.parse(data.drop)
            for (const percentage in drop) {
                for (const itemid in drop[`${percentage}`]) {
                    let randomArray = drop[`${percentage}`][`${itemid}`].split(",").map(Number)[1] ? drop[`${percentage}`][`${itemid}`].split(",").map(Number) : Number(drop[`${percentage}`][`${itemid}`])
                    drop[`${percentage}`][`${itemid}`] = randomArray
                }
            }
            this.drop = drop
        }
    }

    GetRandomDrop() {
        const random = Math.random() * 101
        let Drop = []
        for (const key in this.drop) {
            if (Number(key) >= random) {
                for (const id in this.drop[`${key}`]) {
                    if (Array.isArray(this.drop[`${key}`][`${id}`])) {
                        const item = Items.GetItemWithID(id)
                        let drop = this.drop[`${key}`][`${id}`]
                        const amount = Math.floor(Math.random() * (drop[1] - drop[0] + 1)) + drop[0]
                        Drop.push({Item: item, amount: amount})
                    }
                    else {
                        const item = Items.GetItemWithID(id)
                        Drop.push({Item: item, amount: this.drop[`${key}`][`${id}`]})
                    }
                }
            }
        }
        return Drop
    }

    GetMoneyDrop() {
        let money = 0;
        if (Array.isArray(this.money)) {
            money = Math.floor(Math.random() * (this.money[1] - this.money[0] + 1)) + this.money[0]
        }
        else {
            money = parseInt(this.money)
        }
        return money
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
            if(typeof enemyname !== 'string' || !enemyname || enemyname === "") {
                return new Error("Invalid enemy name")
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
    
        let Enemies = enemies.filter(enemy => enemy.zone === zone)

        if (!Enemies[0]) {
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

            Enemies = Enemies.filter(enemy => enemy.stage <= stage)
            if (!Enemies[0]) {
                const err = new Error(`Not found enemy with stage ${stage}`)
                return err;
            }
            Enemies = Enemies.filter(enemy => rarity[enemy.rarity] >= random)
            const randomEnemy = Enemies[Math.floor(Math.random()*Enemies.length)]
            return new Enemy(randomEnemy)
        }
    }
}

for (const _enemy of enemies) {
    const enemy = new Enemy(_enemy)
    if (!enemy.name || typeof enemy.name !== 'string' || enemy.name.length > 20) {
        const err = new Error(`Invalid enemy name. line: ${enemy.id+1}`)
        throw err;
    }
    if (isNaN(enemy.health) || Number(enemy.health) <= 0) {
        const err = new Error(`Invalid enemy health. line: ${enemy.id+1}`)
        throw err;
    }
    if (!enemy.zone || typeof enemy.zone !== 'string' || enemy.zone.length > 20) {
        const err = new Error(`Invalid enemy zone. line: ${enemy.id+1}`)
        throw err;
    }
    if (isNaN(enemy.stage) || Number(enemy.stage) <= 0 || !Number.isInteger(Number(enemy.stage))) {
        const err = new Error(`Invalid enemy stage. line: ${enemy.id+1}`)
        throw err;
    }
    if (isNaN(enemy.damage) || Number(enemy.damage) <= 0) {
        const err = new Error(`Invalid enemy damage. line: ${enemy.id+1}`)
        throw err;
    }
    if (isNaN(enemy.armor) || Number(enemy.armor) < 0) {
        const err = new Error(`Invalid enemy armor. line: ${enemy.id+1}`)
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
    if (!enemy.rarity || !['common', 'uncommon', 'special', 'rare', 'very_rare', 'mythical'].includes(enemy.rarity)) {
        const err = new Error(`Invalid enemy rarity. line: ${enemy.id+1}`)
        throw err;
    }
    if (enemy.drop) {
        for (const key in enemy.drop) {
            if (isNaN(key) || Number(key) <= 0 || Number(key) > 100) {
                const err = new Error(`Invalid enemy drop percentage. line: ${enemy.id+1}`)
                throw err;
            }
            for (const id in enemy.drop[`${key}`]) {
                if (!Items.GetItemWithID(parseInt(id))) {
                    const err = new Error(`Invalid enemy item drop id. line: ${enemy.id+1}`)
                    throw err;
                }
                let drop = enemy.drop[`${key}`][`${id}`]
                if (Array.isArray(drop)) {
                    if (!drop[0] || !drop[1] || isNaN(drop[0]) || isNaN(drop[1]) || Number(drop[0]) < 1 || Number(drop[0]) >= Number(drop[1])) {
                        const err = new Error(`Invalid enemy item drop amount range. line: ${enemy.id+1}`)
                        throw err;
                    }
                }
                else {
                    if (isNaN(drop) || Number(drop) < 1) {
                        const err = new Error(`Invalid enemy item drop amount. line: ${enemy.id+1}`)
                        throw err;
                    }
                }
            }
        }
    }
    names.push(enemy.name)
}

let findDuplicates = arr => arr.filter((enemy, index) => arr.indexOf(enemy) != index)

findDuplicates(names).forEach(name => {
    for (const _enemy of enemies) {
        const enemy = new Enemy(_enemy)
        if (enemy.name.toLowerCase() === name.toLowerCase()) {
            const err = new Error(`Duplicated enemy name. line: ${enemy.id+1}`)
            throw err;
        }
    }
});

module.exports = { Enemies }