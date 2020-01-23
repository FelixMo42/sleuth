const chalk   = require("chalk")
const Crawler = require("./Crawler")
const fs      = require("fs-extra")
const path    = require("path")
const robots  = require('robots-txt-parse')
const { Readable } = require('stream')
const _ = require("lodash")


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

use( ({url})  => console.log(`visiting ${url.href}`))
use( ({body}) => picoCTF.findFlag(body))

use( ({url, body}) => {

    if (  _.last(url.pathname.split("/")) == "robots.txt" ) {
        robots( Readable.from(body) )
            .then((robots) => {
                console.log(robots)
            })
            .catch((err) => {
                console.log(err)
            })
    }
} )

add( new URL("https://2019shell1.picoctf.com/problem/45102/") )
add( new URL("https://2019shell1.picoctf.com/problem/45102/robots.txt") )
