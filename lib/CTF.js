const chalk = require("chalk")

class CTF {
    constructor({name, flagPattern}) {
        this.name = name
        this.flagPattern = flagPattern
    }

    findFlag(text, shouldPrint=true) {
        let matchs = text.matchAll(this.flagPattern)

        if (shouldPrint) {
            for (let match of matchs) {
                console.log(`* found flag: ${chalk.yellow(match[0])}`)
            }            
        }

        return matchs
    }
}

module.exports = CTF

CTF.hacker101 = new CTF({
    flagPattern: /\^FLAG\^[0-9a-zA-Z]*\$FLAG\$/,
    name: "Hacker101 CTF"
})

CTF.picoCTF = new CTF({
    flagPattern: /picoCTF{.*}/,
    name: "picoCTF 2019"
})