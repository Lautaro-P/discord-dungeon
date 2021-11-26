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
	* [Get stats](#Get-stats)
	* [Equip item](#Equip-item)
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
| Number  | Quality |
| ------------ | ------------ |
| 0  | Common  |
| 1  | Uncommon  |
| 2  | Special  |
| 3  | Rare  |
| 4  | Very Rare  |
| 5  | Mythical   |

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

| Add stat |
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
    "price": 100,
    "quality": 0,
    "type": "material"
}
```

##### Weapon
```js
{
    "id": 2,
    "name": "Sword",
    "sellable": true,
    "price": 2000,
    "quality": 2,
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
    "price": 1500,
    "quality": 1,
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
    "name": "Chestplate helmet",
    "sellable": true,
    "price": 3500,
    "quality": 3,
    "type": "equipment",
    "slot": "chestplate",
    "add": {
        "armor": 8,
		"health_max": 60
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
    "zone": "Cave",
    "stage": 1,
    "health": 5,
    "damage": 1,
    "armor": 1,
    "money": [100, 200], // [min, max] or 100 (fixed quantity)
    "xp": [2, 5], // [min, max] or 2 (fixed quantity),
    "rarity": "common",
    "drop": {
        "100": { // 100 percent
            "1": [5, 7] //Item id 1; [min, max] or 6 (fixed quantity)
        },
        "50": { // 50 percent
            "2": [7, 8] //Item id 1; [min, max] or 6 (fixed quantity)
        },
		"31": { // 32 percent; etc...
			"3": 1 //Item id 1; [min, max] or 6 (fixed quantity)
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
player.GetBag().then(bag => console.log(bag))
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
player.EquipItem(<Item equipment id or name>)
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
