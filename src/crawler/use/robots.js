const path   = require("path")
const robots = require("robots-txt-parse")
const stream = require('stream')
const _      = require("lodash")

module.exports = function() {
    return function(data) {
        if (  _.last(data.url.pathname.split("/")) == "robots.txt" ) {
            robots( stream.Readable.from(data.body) )
                .then((robots) => {
                    for (let group of robots.groups) {
                        for (let rule of group.rules) {
                            add( new URL(rule.path, data.url.href) )
    
                            if (path.isAbsolute(rule.path)) {
                                add( new URL("." + rule.path, data.url.href) )
                            }
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
}