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

// print out that we visited the url
use( ({url})  => console.log(`visiting ${url.href}`))

// try to find the flag in the page
use( ({body}) => picoCTF.findFlag(body))

// if robots.txt, then parse it and add found pages
use( ({url, body}) => {
    if (  _.last(url.pathname.split("/")) == "robots.txt" ) {
        robots( Readable.from(body) )
            .then((robots) => {
                for (let group of robots.groups) {
                    for (let rule of group.rules) {
                        add( new URL(rule.path, "https://2019shell1.picoctf.com/problem/45102/") )

                        if (path.isAbsolute(rule.path)) {
                            add( new URL("." + rule.path, "https://2019shell1.picoctf.com/problem/45102/") )
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
} )

fs.emptyDir("./out/scrape")

// save the files
use( ({url, body}) => {
    let extra = url.pathname.charAt(url.pathname.length - 1) == "/" ? "__index__" : ""
    fs.outputFile(`./out/scrape/${url.hostname}${url.pathname}${extra}`)
} )

function scrape(url) {
    add( new URL(url) )
    add( new URL("/robots.txt", url) )
    add( new URL("./robots.txt", url) )
}


scrape("https://2019shell1.picoctf.com/problem/45102/")