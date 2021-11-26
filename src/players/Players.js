const { Dictionary }= require('../index')
const PlayerSchema = require('../Schemas/Player')

/**
 * Player stats, bag and equipment.
 */
class Player {

    /**
     * 
     * @param {number} userid - Discord user id
     */
    constructor(playerid){

        if(!playerid) {
            const err = new Error("Null user id")
            throw err;
        }

        this.playerid = playerid
    }

    /**
     * Add a number of items to the player bag
     * @param {(number|string)} item Item ID
     * @param {number} [amount] Amount to add (Default: 1)
     * @returns {boolean} Item added successfully
     */
    async AddItem(item, amount = 1) {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        if(!item) {
            const err = new Error("Null item id or name")
            return err;
        }
        if (!Dictionary.Items.GetItemWithName(item, false) && !Dictionary.Items.GetItemWithID(item, false)) {
            const err = new Error('Item not found')
            return err
        }

        if(Number(amount) < 1) {
            const err = new Error('The amount cannot be negative')
            return err;
        }

        if(!Number.isInteger(Number(amount))) console.warn(`\x1b[43m\x1b[30mWARN:\x1b[0m Decimal numbers are not allowed, the number is rounded to ${parseInt(amount)}`)

        let json = player.bag
        amount = parseInt(amount)

        let itemname = item
        if (typeof item === 'string') {
            itemname = Dictionary.Items.GetItemWithID(item).id
        }

        if(!json) json = {}
        if(!json[`${itemname}`]) json[`${itemname}`] = amount
        else {json[`${itemname}`] += amount}

        PlayerSchema.findOneAndUpdate({id: this.playerid}, {bag: json}).catch(err => {
            return err
        })
        return true 
    }

    /**
     * Remove a number of items to the player bag
     * @param {(number|string)} item Item ID or name
     * @param {number} [amount] Amount to remove (Default: 1)
     * @returns {boolean} Item added successfully
     */
    async RemoveItem(item, amount = 1, force = false) {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        if(!item) {
            const err = new Error("Null item id or name") 
            return err;
        }
        if (!Dictionary.Items.GetItemWithName(item, false) && !Dictionary.Items.GetItemWithID(item, false)) {
            const err = new Error('Item not found')
            return err
        }

        if(Number(amount) < 1) {
            const err = new Error('The amount cannot be negative')
            return err;
        }

        if(!Number.isInteger(Number(amount))) console.warn(`\x1b[43m\x1b[30mWARN:\x1b[0m Decimal numbers are not allowed, the number is rounded to ${parseInt(amount)}`)

        let json = player.bag
        amount = parseInt(amount)

        let itemname = item
        if (typeof item === 'string') {
            itemname = Dictionary.Items.GetItemWithID(item).id
        }

        if(!json) json = {}
        if(!json[`${itemname}`]) {
            return false
        }
        if(force) {
            if(json[`${itemname}`] <= amount) {
                delete json[`${itemname}`]
            }
        }

        
        if(!force) {
            if(json[`${itemname}`] < amount) {
                const err = new Error('There are not that many items in the user.')
                return err
            }
            if(json[`${itemname}`] === amount) {
                delete json[`${itemname}`]
            }
        }
        
        if (json[`${itemname}`] > amount) {
            json[`${itemname}`] -= amount
        }

        PlayerSchema.findOneAndUpdate({id: this.playerid}, {bag: json}).catch(err => {
            return err
        })
        return true 
    }

    /**
     * Add a number of items to the player bag
     * @param {(number|string)} item Item ID
     * @param {number} [amount] Amount to add (Default: 1)
     * @returns {boolean} Item added successfully
     */
    async SetItem(item, amount = 1) {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        if(!item) {
            const err = new Error("Null item id or name") 
            return err;
        }
        if (!Dictionary.Items.GetItemWithName(item, false) && !Dictionary.Items.GetItemWithID(item, false)) {
            const err = new Error('Item not found')
            return err
        }
        if(Number(amount) < 1) {
            const err = new Error('The amount cannot be negative')
            return err;
        }

        if(!Number.isInteger(Number(amount))) console.warn(`\x1b[43m\x1b[30mWARN:\x1b[0m Decimal numbers are not allowed, the number is rounded to ${parseInt(amount)}`)

        let json = player.bag
        amount = parseInt(amount)

        let itemname = item
        if (typeof item === 'string') {
            itemname = Dictionary.Items.GetItemWithID(item).id
        }

        if(!json) json = {}
        json[`${itemname}`] = amount

        PlayerSchema.findOneAndUpdate({id: this.playerid}, {bag: json}).catch(err => {
            return err
        })
        return true 
    }

    /**
     * Add a number of items to the player bag
     * @param {(number|string)} item Item ID or name
     * @returns {Item} Item and amount
     */
    async FindItem(item) {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        if(!item) {
            const err = new Error("Null item id or name") 
            return err;
        }
        if (!Dictionary.Items.GetItemWithName(item, false) && !Dictionary.Items.GetItemWithID(item, false)) {
            const err = new Error("Item not found") 
            return err;
        }

        let json = player.bag

        let itemname = item
        if (typeof item === 'string') {
            itemname = Dictionary.Items.GetItemWithID(item).id
        }

        const Item = Dictionary.Items.GetItemWithID(itemname)

        if(!json[`${itemname}`]) {
            return false
        }

        return {Item: Item, amount: json[`${itemname}`]}
    }

    /**
     * Add a number of items to the player bag
     * @param {string} sort Sort bag ('none', 'amount', 'quality')
     * @returns {Item} Item and amount
     */
    async GetBag(sort='none') {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        if (!["none", "amount", "quality"].includes(sort)) {
            const err = new Error('Wrong type sort')
            return err;
        }

        let json = player.bag

        if(!json) {
            const err = new Error('The player has no inventory')
            return err;
        }

        let items = []
        for (const itemid in json) {
            if (Dictionary.Items.GetItemWithID(parseInt(itemid))) {
                items.push({Item: Dictionary.Items.GetItemWithID(parseInt(itemid)), amount:json[`${itemid}`]})
            }
        }
        if (sort === 'amount') {
            items.sort((a, b) => b.amount - a.amount)
        }

        if (sort === 'quality') {
            items.sort((a, b) => b.Item.quality - a.Item.quality)
        }
        
        return items
    }

    /**
     * Add money to the player
     * @param {number} amount
     * @returns {boolean}
     */
    async AddMoney(amount=1) {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        if(Number(amount) < 1) {
            const err = new Error('The amount cannot be negative')
            return err;
        }

        let json = player.money

        if(!json) {
            json = 0
        }

        json += parseInt(amount)
        
        await PlayerSchema.findOneAndUpdate({id: this.playerid}, {money: json}).catch(err => {
            return err
        })
        return true 
    }

    /**
     * Add money to the player
     * @param {number} amount
     * @returns {boolean}
     */
    async RemoveMoney(amount=1) {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        if(Number(amount) < 1) {
            const err = new Error('The amount cannot be negative')
            return err;
        }

        let json = player.money

        if(!json) {
            json = 0
        }

        json -= amount

        await PlayerSchema.findOneAndUpdate({id: this.playerid}, {money: json}).catch(err => {
            return err
        })
        return true 
    }

    /**
     * Add money to the player
     * @param {number} amount
     * @returns {boolean}
     */
    async SetMoney(amount=1) {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        let json = player.money

        if(!json) {
            json = 0
        }

        json.money = amount
        
        await PlayerSchema.findOneAndUpdate({id: this.playerid}, {money: json}).catch(err => {
            return err
        })
        return true 
    }

    async GetStats() {
        let player = await PlayerSchema.findOne({id: this.playerid})
            if (!player) {
                let p = new PlayerSchema({id: this.playerid})
                await p.save()
                player = p
            }
        return player
    }

    async EquipItem(itemid) {
        let player = await PlayerSchema.findOne({id: this.playerid})
        if (!player) {
            let p = new PlayerSchema({id: this.playerid})
            await p.save()
            player = p
        }

        let type = {
            0: 'weapon',
            1: 'helmet',
            2: 'chestplate'
        }
        
        let itemname = itemid
        if (typeof itemid === 'string') {
            itemname = Dictionary.Items.GetItemWithID(itemid).id
        }
        let item = Dictionary.Items.GetItemWithID(itemid)
        
        if (Dictionary.Items.GetItemWithID(itemid).type !== 'equipment') {
            const err = new Error('Invalid item')
            return err
        }

        if (!player.bag[`${itemname}`] || player.bag[`${itemname}`] < 1) {
            const err = new Error('The player does not have that item')
            return err
        }
        
        if (player.equipment[`${item.slot}`] !== -1) {
            let itemE = Dictionary.Items.GetItemWithID(player.equipment[`${item.slot}`])
            if (itemE.add) {
                for (const key in itemE.add) {
                    if (['armor', 'health_max', 'damage'].includes(key)) {
                        if (key !== 'armor') {
                            player[`${key}`] = Math.max(player[`${key}`]-itemE.add[`${key}`], 1) 
                        }
                        else {
                            player[`${key}`] = Math.max(player[`${key}`]-itemE.add[`${key}`], 0) 
                        }
                    }
                }
            }
            if (itemE.remove) {
                for (const key in itemE.remove) {
                    if (['armor', 'health_max', 'damage'].includes(key)) {
                        player[`${key}`] += itemE.remove[`${key}`]
                    }
                }
            }
            await this.AddItem(itemE.id, 1)
        }
        for (const key in item.remove) {
            if (['armor', 'health_max', 'damage'].includes(key)) {
                if (key !== 'armor') {
                    player[`${key}`] = Math.max(player[`${key}`]-item.remove[`${key}`], 1) 
                }
                else {
                    player[`${key}`] = Math.max(player[`${key}`]-item.remove[`${key}`], 0) 
                }
            }
        }
        for (const key in item.add) {
            if (['armor', 'health_max', 'damage'].includes(key)) {
                player[`${key}`] += item.add[`${key}`]
            }
        }
        await this.RemoveItem(item.id, 1, true)
        player.equipment[`${item.slot}`] = item.id
        await PlayerSchema.findOneAndUpdate({id: this.playerid}, {equipment: player.equipment, bag: player.bag, armor: player.armor, health_max: player.health_max, damage: player.damage}).catch(err => {
            return err
        })
        return true 
    }
}

module.exports = {Player}