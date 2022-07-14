const fs = require('fs')
const xlsx = require('xlsx')

if(!fs.existsSync('./discord-dungeon')) {
    fs.mkdirSync('./discord-dungeon')
}

if(!fs.existsSync('./discord-dungeon/skills.xlsx')) {
    const data = [{
        name: "Punch",
        damage: 10,
        type: "attack",
        class: "all",
        animation: "punch",
        frames: 8,
        effect: "damage",
        start_effect: 4,
        frames_effect: 4
    }]

    const newWB = xlsx.utils.book_new()
    const newData = xlsx.utils.json_to_sheet(data)

    xlsx.utils.book_append_sheet(newWB, newData, "Skills")
    xlsx.writeFile(newWB, './discord-dungeon/skills.xlsx')
}

const wb = xlsx.readFile('./discord-dungeon/skills.xlsx')
const ws = wb.Sheets["Skills"]

let data = xlsx.utils.sheet_to_json(ws)

const skills = data.map((_skill, i) => {
    let skill = _skill
    skill.id = i+1
    return skill
})

let names = []

class Skill {
    constructor(data = {}){
        this.id = data.id
        this.name = data.name
        this.damage = data.damage
        this.animation = data.animation
        this.frames = data.frames
        this.effect = data.effect
        this.start_effect = data.start_effect
        this.frames_effect = data.frames_effect
    }
}

class Skills {
    /**
     * Get the skill by ID
     * @param {number} skillid Skill ID
     * @returns {(Skill|false)} Returns {@link Skill}:
     */
     static GetSkillWithID(skillid) {
        if(isNaN(skillid) || Number(skillid) < 0) {
            return new Error("Invalid skill id")
        }

        for (const _skill of skills) {
            if (_skill.id === parseInt(skillid)) return new Skill(_skill)
        }

        return false
    }

    /**
     * Get the skill by Name
     * @param {String} skillName Skill name
     * @returns {(Skill|false)} Returns {@link Skill}:
     */
     static GetSkillWithName(skillName) {
        if(typeof skillName !== 'string' || !skillName || skillName === "") {
            return new Error("Invalid skill name")
        }

        for (const _skill of skills) {
            if (_skill.name.toLowerCase() === skillName.toLowerCase()) return new Skill(_skill)
        }

        return false
    }
}

for (const _skill of skills) {
    const skill = new Skill(_skill)
    if (!skill.name || typeof skill.name !== 'string' || skill.name.length > 20) {
        const err = new Error(`Invalid skill name. line: ${skill.id+1}`)
        throw err;
    }
    if (skill.damage !== 0) {
        if (isNaN(skill.damage) || Number(skill.damage) <= 0) {
            const err = new Error(`Invalid skill damage. line: ${skill.id+1}`)
            throw err;
        }
    }
    if (!skill.type || !["attack", "defend"].includes(skill.type)) {
        const err = new Error(`Invalid skill type. line: ${skill.id+1}`)
        throw err;
    }
    if (!skill.animation || typeof skill.animation !== 'string' || skill.animation.length > 30) {
        const err = new Error(`Invalid skill animation. line: ${skill.id+1}`)
        throw err;
    }
    if (skill.frames !== 0) {
        if (isNaN(skill.frames) || Number(skill.frames) <= 0) {
            const err = new Error(`Invalid skill frames. line: ${skill.id+1}`)
            throw err;
        }
    }
    if (!skill.effect || typeof skill.effect !== 'string' || skill.effect.length > 30) {
        const err = new Error(`Invalid skill effect. line: ${skill.id+1}`)
        throw err;
    }
    if (skill.start_effect !== 0) {
        if (isNaN(skill.start_effect) || Number(skill.start_effect) <= 0) {
            const err = new Error(`Invalid skill start_effect. line: ${skill.id+1}`)
            throw err;
        }
    }
    if (skill.frames_effect !== 0) {
        if (isNaN(skill.frames_effect) || Number(skill.frames_effect) <= 0) {
            const err = new Error(`Invalid skill frames_effect. line: ${skill.id+1}`)
            throw err;
        }
    }
    names.push(skill.name)
}

let findDuplicates = arr => arr.filter((skill, index) => arr.indexOf(skill) != index)

findDuplicates(names).forEach(name => {
    for (const _skill of skills) {
        const skill = new Skill(_skill)
        if (skill.name.toLowerCase().trim() === name.toLowerCase().trim()) {
            const err = new Error(`Duplicated skill name. line: ${skill.id+1}`)
            throw err;
        }
    }
});

module.exports = {Skills}