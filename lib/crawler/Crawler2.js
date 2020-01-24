// const Bottleneck = require("bottleneck")


// const options = {
//     /* bottle neck options */
//     maxConcurrent: 100,
//     minTime: 1/10,
//     // reservoir: 100,
//     // reservoirRefreshAmount: 100,
//     // reservoirRefreshInterval: 60 * 1000,

//     /* validity options */
//     whitelist: [],
//     blacklist: [],
// }

// let bottleneck = new Bottleneck(options)

// let visited = new Set()

// let post = (response) => {
//     console.log(response.request._header)
//     console.log(response.data)
// }  

// let add = bottleneck.wrap(params => request(params).then(post))

// let urlHash = (data) => JSON.stringify(data)

// let defaultHeaders = {
//     "Accept": "application/json, text/plain, */*",
//     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
//     "Accept-Language": "en-US,en;q=0.9,fr;q=0.8,la;q=0.7",
// }
// let make = (method, url, headers, data) => ({
//     method: method,
//     protocol: url.protocol.replace(":","").toUpperCase(),
//     url: new URL(url).href,
//     headers: {
//         ...defaultHeaders,
//         ...headers
//     },
//     data: data
// })
