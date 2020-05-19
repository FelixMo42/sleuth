const Bottleneck = require("bottleneck")
const quest      = require("sleuth/quest")
const _ = require("lodash")

const defaultHeaders = [
    {
        name: "Accept",
        values: [
            { value: "*/*" }
        ]
    },
    {
        name: "User-Agent",
        values: [
            { value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36" }
        ]
    },
    {
        name: "Accept-Language",
        values: [
            { value: "en-US" },
            { value: "en" , params: ["q=0.9"] },
            { value: "fr" , params: ["q=0.8"] },
            { value: "la" , params: ["q=0.7"] }
        ]
    }
]

const defaultOptions = {
    /* bottle neck options */
    maxConcurrent: 100,
    minTime: 1/10,
    // reservoir: 100,
    // reservoirRefreshAmount: 100,
    // reservoirRefreshInterval: 60 * 1000,

    /* quest options */
    defaultMethod: "GET",
    defaultHeaders: defaultHeaders,
    defaultCookies: [],

    /* validity options */
    whitelist: [],
    blacklist: [],
    repeats: false,

    callbacks: []
}

module.exports = function Crawler(options) {
    options = _.defaults(options, defaultOptions)

    let bottleneck = new Bottleneck(options)

    let visited = new Set()

    let push = bottleneck.wrap(request =>   quest(request).then(response =>
        Promise.all(options.callbacks.map(callback => callback(response)))
    ) )

    function add(params) {
        let request = quest.make(params, options)

        if (!options.repeats) {
            let hash = quest.toJson(request)

            if (visited.has(hash)) {
                return //TODO:
            }

            visited.add(hash)
        }

        if ( !options.whitelist.some(pattern => request.url.match(pattern)) ) {
            return false //TODO:
        }

        if ( options.blacklist.some(pattern => request.url.match(pattern)) ) {
            return false //TODO:
        }

        return push(request)
    }

    return add
}