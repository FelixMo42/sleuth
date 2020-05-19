let Crawler = require("sleuth/crawler/Crawler")
let picoCTF = require("sleuth/CTF").picoCTF

let add = new Crawler({
    whitelist: [ /^https:\/\/2019shell1\.picoctf\.com\/problem\/37868\// ],
    blacklist: [ /\.jpg$/ ],

    callbacks: [
        require("sleuth/crawler/use/logger")(),
        require("sleuth/crawler/use/robots")(),
        // require("sleuth/crawler/use/save")(),
        // require("sleuth/crawler/use/html")(),
        ({body}) => picoCTF.findFlag(body)
    ]
})

function search(url) {
    let fragments = [
        "/robots.txt",
        "/sitemap.xml",
        "/login.html",
        "/login.php"
    ]

    add( url )

    for (let fragment of fragments) {
        add( new URL(fragment, url).href )
        add( new URL("." + fragment, url).href )
    }
}

search("https://2019shell1.picoctf.com/problem/37868/")

// let quest = require("sleuth/quest")

// quest({
//     url:"http://35.190.155.168/191239ea0c/page/edit/5",
//     method: "GET",
//     headers: []
// }).then(response => console.log(response.body))