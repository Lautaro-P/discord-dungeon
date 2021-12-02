# Discord-Dungeon

* [Initialization](#Initialization)
	* [Connect MongoDB](#Connect-MongoDB)
	* [Create item](#Create-item)
		* [Quality](#Quality)
		* [Type Items](#Type)
		* [Examples items](#Examples-items)
			* [Material](#Material)
			* [Weapon](#Weapon)
			* [Helmet](#Helmet)
			* [Chestplate](#Chestplate)
            * [Craftable](#Craftable)
	* [Create enemy](#Create-enemy)
		* [Rarity enemy](#Rarity-enemy)
		* [Examples enemies](#Examples-enemies)
			* [Slime](#Slime)
* [Players](#Players)
	* [Add item](#Add-Item)
	* [Remove item](#Remove-Item)
	* [Set item](#Set-Item)
	* [Find Item in bag](#Find-Item-in-bag)
	* [Get bag](#Get-bag)
	* [Add money](#Add-money)
	* [Remove money](#Remove-money)
	* [Set money](#Set-money)
    * [Add health](#Add-health)
    * [Take damage](#Take-damage)
	* [Get stats](#Get-stats)
	* [Equip item](#Equip-item)
    * [Craft item](#Craft-item)
    * [Sell item](#Sell-item)
    * [Buy item](#Buy-item)
* [Enemies](#Enemies)
	* [Get enemy with id](#Get-enemy-with-id)
	* [Get enemy with name](#Get-enemy-with-name)
	* [Get a random enemy from a stage and zone](#Get-a-random-enemy-from-a-stage-and-zone)
	* [Enemy](#Enemy)
		* [Get random drop](#Get-random-drop)
* [Items](#Items)
	* [Get item with id](#Get-item-with-id)
	* [Get item with name](#Get-item-with-name)
	* [Get all items](#Get-all-items)

------------

## Initialization
### Connect-MongoDB
```js
const {Dungeon} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')
```
#### Create-item
To create an item you must create a .json in **./discord-dungeon/items**.

##### Quality
| Quality |
| ------------ |
| common  |
| uncommon  |
| special  |
| rare  |
| very_rare  |
| mythical   |

##### Type Items
| Type |
| ------------ |
| material  |
| equipment  |



| Equipment |
| ------------ |
| weapon  |
| helmet  |
| chestplate  |



| Add or remove stat |
| ------------ |
| health_max  |
| damage  |
| armor  |

#### Examples-items

##### Material
```json
{
    "id": 1,
    "name": "Wood",
    "sellable": true,
    "sell": 100,
    "purchasable": true,
    "buy": 200,
    "quality": "common",
    "type": "material"
}
```

##### Weapon
```js
{
    "id": 2,
    "name": "Iron Sword",
    "sellable": true,
    "sell": 2000,
    "purchasable": true,
    "buy": 4000,
    "quality": "special",
    "type": "equipment",
    "slot": "weapon",
    "add": {
        "damage": 5
    },
    "remove": {
        "health_max": 10
    }
}
```

##### Helmet
```js
{
    "id": 3,
    "name": "Iron helmet",
    "sellable": true,
    "sell": 1500,
    "purchasable": true,
    "buy": 3000,
    "quality": "uncommon",
    "type": "equipment",
    "slot": "helmet",
    "add": {
        "armor": 4,
	"health_max": 30
    }
}
```

##### Chestplate
```js
{
    "id": 4,
    "name": "Iron Chestplate",
    "sellable": true,
    "sell": 3500,
    "purchasable": true,
    "buy": 7000,
    "quality": "rare",
    "type": "equipment",
    "slot": "chestplate",
    "add": {
        "armor": 8,
	"health_max": 60
    }
}
```

##### Craftable
Need 8 items with ID 1 for craft this item.
```js
{
    "id": 5,
    "name": "Wooden Chestplate",
    "sellable": true,
    "sell": 2500,
    "purchasable": true,
    "buy": 5000,
    "quality": 3,
    "type": "equipment",
    "slot": "chestplate",
    "add": {
        "armor": 2,
	    "health_max": 20
    }
    "craftable": true
    "craft": {
        "1": 8
        // "ID": <amount>
    }
}
```

#### Create-enemy
To create an enemy you must create a .json in **./discord-dungeon/enemies**.

##### Rarity-enemy
| Rarity | Percentage |
| ------------ | ------------ |
| common  | 100  |
| uncommon  | 60  |
| special  | 30  |
| rare  | 12  |
| very_rare  | 6  |
| mythical  | 2  |

#### Examples-enemies

##### Slime

```js
{
    "id": 1,
    "name": "Slime",
    "zone": "Cave", // Spawning area;
    "stage": 1, // Stage where it spawns;
    "health": 5,
    "damage": 1,
    "armor": 1,
    "money": [100, 200], // Array:[min, max] or Number;
    "xp": [2, 5], // Array:[min, max] or Number;
    "rarity": "common",
    "drop": {
        "100": { // 100 percent;
        	"1": [5, 7] //Item id 1; Array:[min, max] or Number;
        },
        "50": { // 50 percent;
        	"2": [7, 8] //Item id 2; Array:[min, max] or Number;
        },
	"32": { // 32 percent; etc...
		"3": 1 //Item id 3; Array:[min, max] or Number;
	}
    }
}
```

## Players

### Add-Item
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.AddItem(<Item id or name>, <amount>)
```

### Remove-Item
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.RemoveItem(<Item id or name>, <amount>)
```

### Set-Item
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.SetItem(<Item id or name>, <amount>)
```

### Find-Item-in-bag
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.FindItem(<Item id or name>).then(item => console.log(item))
```

### Get-bag
| Sort type  |
| ------------ |
| none  |
| amount  |
| quality  |

```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.GetBag(<Sort type>).then(bag => console.log(bag))
```

### Add-money
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.AddMoney(<Amount>)
```

### Remove-money
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.RemoveMoney(<Amount>)
```

### Set-money
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.SetMoney(<Amount>)
```

### Add-health
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.AddHealth(<Amount>, <true or false>) // true=add to health_max, false=add to health, Default: false
```

### Take-damage
If the player receives mortal damage he will revive with half the items, money and health.
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.TakeDamage(<amount>)
```

### Get-stats
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.GetStats().then(stats => console.log(stats))
```

### Equip-item
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.EquipItem(<Item id or name>)
```

### Craft-item
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.CraftItem(<Item id or name>, <amount>)
```

### Sell-item
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.SellItem(<Item id or name>, <amount>)
```

### Buy-item
```js
const {Dungeon, Players} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const player = new Players.Player('<DISCORD-ID>')
player.BuyItem(<Item id or name>, <amount>)
```

## Enemies

### Get-enemy-with-id
```js
const {Dungeon, Bestiary} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const enemy = Bestiary.Enemies.GetEnemyWithID(<Enemy id>)
```

### Get-enemy-with-name
```js
const {Dungeon, Bestiary} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const enemy = Bestiary.Enemies.GetEnemyWithName(<Enemy name>)
```

### Get-a-random-enemy-from-a-stage-and-zone
```js
const {Dungeon, Bestiary} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const enemy = Bestiary.Enemies.GetRandomEnemy(<Zone>, <Stage>)
```

### Enemy

#### Get-random-drop
```js
const {Dungeon, Bestiary} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const enemy = Bestiary.Enemies.GetRandomEnemy(<Zone>, <Stage>)
const drop = enemy.GetRandomDrop()
```

## Items

### Get item with id
```js
const {Dungeon, Dictionary} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const enemy = Dictionary.Items.GetItemWithID(<Item id>)
```

### Get-item-with-name
```js
const {Dungeon, Dictionary} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const enemy = Dictionary.Items.GetItemWithName(<Item name>)
```

### Get-all-items
| Sort type  |
| ------------ |
| alphabet  |
| id  |
| quality  |
| price  |

```js
const {Dungeon, Dictionary} = require('discord-dungeon')
const client = new Dungeon.Client('<MONGODB-URL>')

const enemy = Dictionary.Items.GetAllItems(<Sort type>)
```
