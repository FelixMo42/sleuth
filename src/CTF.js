const chalk   = require("chalk")
const Crawler = require("./crawler/Crawler")

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

let hacker101 = new CTF({
    flagPattern: /\^FLAG\^[0-9a-zA-Z]*\$FLAG\$/,
    name: "Hacker101 CTF"
})

let picoCTF = new CTF({
    flagPattern: /picoCTF{.*}/,
    name: "picoCTF 2019"
})


let { use, add } = new Crawler()

use( ({body}) => picoCTF.findFlag(body) )

use( require("./crawler/use/logger")() )
use( require("./crawler/use/robots")() )
use( require("./crawler/use/save")() )

let fragments = [
    "/robots.txt",
    "/sitemap.xml",
    "/login.html",
    "/login.php"
]

function search(url) {
    add( new URL(url) )

    for (let fragment of fragments) {
        add( new URL(fragment, url) )
        add( new URL("." + fragment, url) )
    }
}


search("https://2019shell1.picoctf.com/problem/37868/")