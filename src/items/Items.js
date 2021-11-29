const fs = require('fs')

if(!fs.existsSync('./discord-dungeon')) {
    fs.mkdirSync('./discord-dungeon')
}

if(!fs.existsSync('./discord-dungeon/items')) {
    fs.mkdirSync('./discord-dungeon/items')
}

const items = fs.readdirSync('./discord-dungeon/items')
let ids = []
let names = []

for (const _item of items) {
    const item = JSON.parse(fs.readFileSync(`./discord-dungeon/items/${_item}`, "utf8"))
    if (!item.id || isNaN(item.id) || Number(item.id) <= -1 || !Number.isInteger(Number(item.id))) {
        const err = new Error(`Invalid item id. ${_item}`)
        throw err;
    }
    if (!item.name || typeof item.name !== 'string' || item.name.length > 20) {
        const err = new Error(`Invalid item name. ${_item}`)
        throw err;
    }
    if (item.sellable === true) {
        if (!item.price || isNaN(item.price) || Number(item.price) <= 0) {
            const err = new Error(`Invalid item price. ${_item}`)
            throw err;
        }
    }
    if (!item.quality || isNaN(item.quality) || ![0,1,2,3,4,5].includes(Number(item.quality))) {
        const err = new Error(`Invalid item quality. ${_item}`)
        throw err;
    }
    if (!['material', 'equipment'].includes(item.type)) {
        const err = new Error(`Invalid item type. ${_item}`)
        throw err;
    }
    if(item.type === 'equipment') {
        if (!item.slot || !['weapon', 'helmet', 'chestplate'].includes(item.slot) ) {
            const err = new Error(`Invalid item slot. ${_item}`)
            throw err;
        }
        if (item.add) {
            for (const key in item.add) {
                if (!['health_max', 'damage', 'armor'].includes(key)) {
                    const err = new Error(`Invalid item add stat ${key}. ${_item}`)
                    throw err;
                }
                else {
                    if (isNaN(item.add[`${key}`]) || Number(item.add[`${key}`]) <= -1 || !Number.isInteger(Number(item.add[`${key}`]))) {
                        const err = new Error(`Invalid item add value stat ${key}. ${_item}`)
                        throw err;
                    }
                }
            }
        }
        if (item.remove) {
            for (const key in item.remove) {
                if (!['health_max', 'damage', 'armor'].includes(key)) {
                    const err = new Error(`Invalid item add stat ${key}.`)
                    throw err;
                }
                else {
                    if (isNaN(item.remove[`${key}`]) || Number(item.remove[`${key}`]) < 0 || !Number.isInteger(Number(item.remove[`${key}`]))) {
                        const err = new Error(`Invalid item add value stat ${key}.`)
                        throw err;
                    }
                }
            }
        }
        if(item.craftable === true) {
            if (!item.craft) {
                const err = new Error(`Invalid item craft. ${_item}`)
                throw err;
            }
            if (item.craft) {
                for (const key in item.craft) {
                    if (!Items.GetItemWithID(key)) {
                        const err = new Error(`Invalid material id craft ${key}. ${_item}`)
                        throw err;
                    }
                    else {
                        if (isNaN(item.craft[`${key}`]) || Number(item.craft[`${key}`]) <= -1 || !Number.isInteger(Number(item.craft[`${key}`]))) {
                            const err = new Error(`Invalid material amount craft ${key}. ${_item}`)
                            throw err;
                        }
                    }
                }
            }
        }
    }
    ids.push(item.id)
    names.push(item.name)
}

let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

findDuplicates(ids).forEach(id => {
    for (const _item of items) {
        const item = JSON.parse(fs.readFileSync(`./discord-dungeon/items/${_item}`, "utf8"))
        if (item.id === parseInt(id)) {
            const err = new Error(`Duplicated item id. ${_item}`)
            throw err;
        }
    }
});

findDuplicates(names).forEach(name => {
    for (const _item of items) {
        const item = JSON.parse(fs.readFileSync(`./discord-dungeon/items/${_item}`, "utf8"))
        if (item.name.toLowerCase() === name.toLowerCase()) {
            const err = new Error(`Duplicated item name. ${_item}`)
            throw err;
        }
    }
});

class Item {
    constructor(data = {}){

        this.id = data.id
        this.name = data.name
        if (data.sellable === true) {
            this.price = data.price
        }
        this.quality = data.quality
        this.type = data.type
        if (data.type === 'equipment') {
            this.slot = data.slot
            this.add = data.add
            this.remove = data.remove
        }
        if (data.craftable === true) {
            this.craft = data.craft
        }
    }
}

class Items {

    /**
     * Get the item by ID
     * @param {number} itemid Item ID
     * @param {boolean} [force] 
     * @returns {(Item|false)} Returns {@link Item}:
     * ```json 
     * {id: 0, price: 123} 
     * ```
     * if not found returns false
     */

    static GetItemWithID(itemid, force = true) {
        if (!force) {
            if(isNaN(itemid) || Number(itemid) < 0) {
                return new Error("Invalid item id")
            }
        }
        const items = fs.readdirSync('./discord-dungeon/items')

        for (const _item of items) {
            const item = JSON.parse(fs.readFileSync(`./discord-dungeon/items/${_item}`, "utf8"))
            if (item.id === parseInt(itemid)) return new Item(item)
        }

        return false
    }

    /**
     * Get the item by name
     * @param {string} itemname Item name
     * @param {boolean} [force] 
     * @returns {(Item|false)} Returns {@link Item}:
     * ```json 
     * {id: 0, price: 123} 
     * ```
     * if not found returns false
     */

    static GetItemWithName(itemname, force = true) {
        if (!force) {
            if(!typeof itemname === 'string' || !itemname || itemname === "") {
                throw new Error("Null item name")
            }
        }
        
        const items = fs.readdirSync('./discord-dungeon/items')

        for (const _item of items) {
            const item = JSON.parse(fs.readFileSync(`./discord-dungeon/items/${_item}`, "utf8"))
            if (item.name.toLowerCase() === itemname.toLowerCase()) return new Item(item)
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
            throw err;
        }

        const _items = fs.readdirSync('./discord-dungeon/items')

        let items = []
        for (const _item of _items) {
            let item = JSON.parse(fs.readFileSync(`./discord-dungeon/items/${_item}`, "utf8"))
            items.push(new Item(item))
        }

        if(sort === 'id') {
            items.sort((a, b) => a.id - b.id)
        }

        if(sort === 'quality') {
            items.sort((a, b) => b.quality - a.quality)
        }

        if(sort === 'price') {
            items.sort((a, b) => b.price - a.price)
        }

        return items
    }
}

module.exports = {Items}