# Discord-Dungeon

* [Initialization](#Initialization)
	* [Connect MongoDB](#Connect-MongoDB)
	* [Create item](#Create-item)
	* [Create enemy](#Create-enemy)
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

![Items Examples](https://user-images.githubusercontent.com/86976644/145051806-0aaa990d-7467-410a-95c7-668a8ed70eb1.png)

To create items you must modify the file located at './discord-dungeon/items.xlsx'. The columns should be named with the following specification:

 > Item ID is its row minus 1

 - name: this will be the name of the item.

 - buyprice: this is the buy price that will be used for the item in the shop. Set to 0 to make this unbuyable.

 - sellprice: this is the sell price that will be used for the item in the shop. Set to 0 to make this unsellable.

 - quality: this will be the quality of the item.

 - type: this will be the type of item. There are only 2 types: ("material" and "equipment").

 - slot: (only if the type of item is "equipment") this will be the type of item. There are only 3 slots: ("weapon", "helmet" and "chestplate").

 - add: (only if the type of item is "equipment") this will be the stats that the item adds.
 > Structure: {"health_max", "armor" or "damage": amount}.
 > 
 > Example: {"health_max": 20, "armor": 5}

 - remove: (only if the type of item is "equipment") this will be the stats that the item removes.
 > Structure: {"health_max", "armor" or "damage": amount}.
 > 
 > Example: {"health_max": 20, "armor": 5}

 - craft: this will be what the article requires to be crafted.
 > Structure: {"item id": amount}.
 > 
 > Example: {"1": 5, "3": 12}

#### Create-enemy

![Enemies Example](https://user-images.githubusercontent.com/86976644/145060370-24e9154e-ce85-4334-9ed3-68135bf70523.png)

To create items you must modify the file located at './discord-dungeon/enemies.xlsx'. The columns should be named with the following specification:

 > Enemy ID is its row minus 1

 - zone: this will be the zone where the enemy appears.

 - stage: this will be the stage where the enemy will start to appear.

 - health: this will be the enemy's health.

 - damage: this will be the enemy's damage.

 - armor: this will be the enemy's armor.

 - money: this will be the amount of money that the enemy drops.
 > Structure: 20 or 20,40 (20,40 will choose a random number between 20 and 40)

 - rarity: this will be the rarity to appear from the enemy.

 -
	| Rarity | Percentage |
	| ------------ | ------------ |
	| common  | 100  |
	| uncommon  | 60  |
	| special  | 30  |
	| rare  | 12  |
	| very_rare  | 6  |
	| mythical  | 2  |


 - drop: this will be the quantity and probability of dropping items.
 > Structure: {"percentage": {"item id": the amounts you can drop}, "percentage 2": {"item id 2": the amounts you can drop}}.
 > 
 > Example: {"100": {"1": "5,10"}, "50": {"2": "1,8", "3": "2,4"}}
 > drops with 100 probability the item with id 1 between 5 and 10, with 50 probability the items with id 2 between 1 and 8, with id 3 between 2 and 4

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
