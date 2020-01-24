const Bottleneck = require("bottleneck")
const request    = require("request")
const _          = require("lodash")

const defaultOptions = {
    /* bottle neck options */
    maxConcurrent: 100,
    minTime: 1/10,
    // reservoir: 100,
    // reservoirRefreshAmount: 100,
    // reservoirRefreshInterval: 60 * 1000,

    /* validity options */
    whitelist: [],
    blacklist: [],
}

function Crawler(options) {
    options = _.defaults(options, defaultOptions)

    let limiter = new Bottleneck(options)

    callbacks = []
    
    function processUrl(url) {
        return new Promise((resolve, reject) => {
            let req = request(url.href, (error, response, body) => {
                let data = Object.freeze({url, error, body, response, crawler})
    
                if (typeof data.body == "undefined") {
                    console.log(url)
                    console.log(error)
                }

                let all = Promise.all( callbacks.map(callback => callback(data)) )
                all.then(resolve)
                all.catch(err => {console.log(err); resolve()})
            })
        })
    }

    const queue = limiter.wrap(processUrl)
    const visisted = new Set()

    let crawler = {
        add : (url) => {
            if (url.hostname == "") {
                return false
            }

            if (visisted.has(url.href)) {
                return false
            }

            visisted.add(url.href)

            if (options.whitelist.length != 0) {
                if ( !options.whitelist.every( pattern => url.href.match(pattern) != undefined ) ) {
                    return false
                }
            }

            if (options.blacklist.length != 0) {
                if ( !options.blacklist.some( pattern => url.href.match(pattern) == undefined ) ) {
                    return false
                }
            }

            return queue(url)
        },
        use : (callback) => {
            callbacks.push(callback)
        }
    }

    return crawler
}

module.exports = Crawler