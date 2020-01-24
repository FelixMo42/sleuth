let Crawler = require("sleuth/crawler/Crawler")
let picoCTF = require("sleuth/CTF").picoCTF

let { use, add } = new Crawler({
    whitelist: [ /^https:\/\/2019shell1\.picoctf\.com\/problem\/37868\// ],
    blacklist: [ /\.jpg$/ ]
})

use( ({body}) => picoCTF.findFlag(body) )

use( require("sleuth/crawler/use/logger")() )
use( require("sleuth/crawler/use/robots")() )
use( require("sleuth/crawler/use/save")() )
use( require("sleuth/crawler/use/html")() )

function search(url) {
    let fragments = [
        "/robots.txt",
        "/sitemap.xml",
        "/login.html",
        "/login.php"
    ]

    add( new URL(url) )

    for (let fragment of fragments) {
        add( new URL(fragment, url) )
        add( new URL("." + fragment, url) )
    }
}

search("https://2019shell1.picoctf.com/problem/37868/")