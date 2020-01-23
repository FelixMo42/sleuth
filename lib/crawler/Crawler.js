const Bottleneck = require("bottleneck")
const request    = require("request")
const _          = require("lodash")

const defaultOptions = {
    /* bottle neck options */
    maxConcurrent: 10,
    minTime: 1/5,
    // reservoir: 100,
    // reservoirRefreshAmount: 100,
    // reservoirRefreshInterval: 60 * 1000
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
                return
            }

            if (visisted.has(url.href)) {
                return 
            }

            visisted.add(url.href)

            return queue(url)
        },
        use : (callback) => {
            callbacks.push(callback)
        }
    }

    return crawler
}

module.exports = Crawler