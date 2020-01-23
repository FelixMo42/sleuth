const Bottleneck = require("bottleneck")
const request    = require("request-promise-native")

const options = {
    /* bottle neck options */
    maxConcurrent: 1,
    minTime: 1,
    // reservoir: 100,
    // reservoirRefreshAmount: 100,
    // reservoirRefreshInterval: 60 * 1000
}

function Crawler() {
    let limiter = new Bottleneck(options)

    callbacks = []

    function processUrl(url) {
        return request(url.href).then((body) => {
            let data = {url, body}

            return Promise.all( callbacks.map(callback => callback(data)) )
        })
    }

    const queue = limiter.wrap(processUrl)
    const visisted = new Set()

    return {
        add : (url) => {

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
}

module.exports = Crawler