const path   = require("path")
const robots = require("robots-txt-parse")
const stream = require("stream")
const _      = require("lodash")

module.exports = function() {
    return function(response) {
        if (  _.last(response.url.split("/")) == "robots.txt" ) {
            robots( stream.Readable.from(response.body) )
                .then((robots) => {
                    for (let group of robots.groups) {
                        for (let rule of group.rules) {
                            add( new URL(rule.path, response.url) )
    
                            if (path.isAbsolute(rule.path)) {
                                add( new URL("." + rule.path, response.url) )
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