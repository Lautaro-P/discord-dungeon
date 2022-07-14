const fs = require('fs')
const xlsx = require('xlsx')
const { Skills } = require('../skills/Skills')

if(!fs.existsSync('./discord-dungeon')) {
    fs.mkdirSync('./discord-dungeon')
}

if(!fs.existsSync('./discord-dungeon/items.xlsx')) {
    const data = [
        {
            name:"Wood",
            sellPrice:10,
            buyPrice:0,
            quality: "common",
            type: "material",
            slot:"",
            class: "",
            skill: "",
            add: "{}",
            remove: "{}",
            craft: "{}"
        },
        {
            name:"Sword",
            sellPrice:20,
            buyPrice:10,
            quality: "common",
            type: "equipment",
            slot:"weapon",
            class: "warrior",
            skill: "1",
            add: '{"damage":3, "health_max":20}',
            remove: '{"armor":2}',
            craft: '{"1": 4}'
        }
    ]

    const newWB = xlsx.utils.book_new()
    const newData = xlsx.utils.json_to_sheet(data)

    xlsx.utils.book_append_sheet(newWB, newData, "Items")
    xlsx.writeFile(newWB, './discord-dungeon/items.xlsx')
}

const wb = xlsx.readFile('./discord-dungeon/items.xlsx')
const ws = wb.Sheets["Items"]

let data = xlsx.utils.sheet_to_json(ws)

const items = data.map((_item, i) => {
    let item = _item
    item.id = i+1
    return item
})
let names = []

class Item {
    constructor(data = {}){
        this.id = data.id
        this.name = data.name
        this.sellPrice = data.sellPrice
        this.buyPrice = data.buyPrice
        this.quality = data.quality
        this.type = data.type
        if (data.type === 'equipment') {
            this.class = data.class
            this.skill = data.skill
            this.slot = data.slot
            this.add = JSON.parse(data.add)
            this.remove = JSON.parse(data.remove)
        }
        if (data.craft !== "{}") {
            this.craft = JSON.parse(data.craft)
        }
    }
}

class Items {

    /**
     * Get the item by ID
     * @param {number} itemid Item ID
     * @returns {(Item|false)} Returns {@link Item}:
     * ```json 
     * {id: 0, price: 123} 
     * ```
     * if not found returns false
     */

    static GetItemWithID(itemid) {
        if(isNaN(itemid) || Number(itemid) < 0) {
            return new Error("Invalid item id")
        }

        for (const _item of items) {
            if (_item.id === parseInt(itemid)) return new Item(_item)
        }

        return false
    }

    /**
     * Get the item by name
     * @param {string} itemname Item name
     * @returns {(Item|false)} Returns {@link Item}:
     * ```json 
     * {id: 0, price: 123} 
     * ```
     * if not found returns false
     */

    static GetItemWithName(itemname) {
        if(typeof itemname !== 'string' || !itemname || itemname === "") {
        return new Error("Null item name")
        }

        for (const _item of items) {
            if (_item.name.toLowerCase() === itemname.toLowerCase()) return new Item(_item)
        }

        return false
    }

    /**
     * Get all items in the dictionary
     * @param {string} sort Sort type ('alphabet', 'id', 'quality', 'price')
     * @returns {Item[]} Item removed successfully
     */

    static GetAllItems(sort='alphabet') {
        if (!['alphabet', 'id', 'quality', 'price'].includes(sort)) {
            const err = new Error('Wrong type sort')
            return err;
        }

        let Items = []
        for (const _item of items) {
            Items.push(new Item(_item))
        }

        if(sort === 'id') {
            Items.sort((a, b) => a.id - b.id)
        }

        if(sort === 'quality') {
            Items.sort((a, b) => b.quality - a.quality)
        }

        if(sort === 'price') {
            Items.sort((a, b) => b.sellPrice - a.sellPrice)
        }

        return Items
    }
}

for (const _item of items) {
    const item = new Item(_item)
    if (!item.name || typeof item.name !== 'string' || item.name.length > 20) {
        const err = new Error(`Invalid item name. line: ${item.id+1}`)
        throw err;
    }
    if (item.sellPrice !== 0) {
        if (isNaN(item.sellPrice) || Number(item.sellPrice) <= 0) {
            const err = new Error(`Invalid item price sell. line: ${item.id+1}`)
            throw err;
        }
    }
    if (item.buyPrice !== 0) {
        if (isNaN(item.buyPrice) || Number(item.buyPrice) <= 0) {
            const err = new Error(`Invalid item price buy. line: ${item.id+1}`)
            throw err;
        }
    }
    if (!item.quality || !['common', 'uncommon', 'special', 'rare', 'very_rare', 'mythical'].includes(item.quality)) {
        const err = new Error(`Invalid item quality. line: ${item.id+1}`)
        throw err;
    }
    if (!['material', 'equipment'].includes(item.type)) {
        const err = new Error(`Invalid item type. line: ${item.id+1}`)
        throw err;
    }
    if(item.type === 'equipment') {
        if (!item.slot || !['weapon', 'helmet', 'chestplate'].includes(item.slot) ) {
            const err = new Error(`Invalid item slot. line: ${item.id+1}`)
            throw err;
        }
        if (!item.class || !['warrior', 'magician', 'tank', 'mechanic', 'trainer'].includes(item.class) ) {
            const err = new Error(`Invalid item class. line: ${item.id+1}`)
            throw err;
        }
        if (!item.skill || !Skills.GetSkillWithID(item.skill) ) {
            const err = new Error(`Invalid Item skill id. line: ${item.id+1}`)
            throw err;
        }
        if (item.add) {
            for (const key in item.add) {
                if (!['health_max', 'armor'].includes(key)) {
                    const err = new Error(`Invalid item add stat ${key}. line: ${item.id+1}`)
                    throw err;
                }
                else {
                    if (isNaN(item.add[`${key}`]) || Number(item.add[`${key}`]) <= -1 || !Number.isInteger(Number(item.add[`${key}`]))) {
                        const err = new Error(`Invalid item add value stat ${key}. line: ${item.id+1}`)
                        throw err;
                    }
                }
            }
        }
        if (item.remove) {
            for (const key in item.remove) {
                if (!['health_max', 'armor'].includes(key)) {
                    const err = new Error(`Invalid item add stat ${key}. line: ${item.id+1}`)
                    throw err;
                }
                else {
                    if (isNaN(item.remove[`${key}`]) || Number(item.remove[`${key}`]) < 0 || !Number.isInteger(Number(item.remove[`${key}`]))) {
                        const err = new Error(`Invalid item add value stat ${key}. line: ${item.id+1}`)
                        throw err;
                    }
                }
            }
        }

        if (item.craft) {
            for (const key in item.craft) {
                if (!Items.GetItemWithID(key)) {
                    const err = new Error(`Invalid material id craft ${key}. line: ${item.id+1}`)
                    throw err;
                }
                else {
                    if (isNaN(item.craft[`${key}`]) || Number(item.craft[`${key}`]) <= -1 || !Number.isInteger(Number(item.craft[`${key}`]))) {
                        const err = new Error(`Invalid material amount craft ${key}. line: ${item.id+1}`)
                        throw err;
                    }
                }
            }
        }
    }
    names.push(item.name)
}

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

findDuplicates(names).forEach(name => {
    for (const _item of items) {
        const item = new Item(_item)
        if (item.name.toLowerCase().trim() === name.toLowerCase().trim()) {
            const err = new Error(`Duplicated item name. line: ${item.id+1}`)
            throw err;
        }
    }
});

module.exports = {Items}