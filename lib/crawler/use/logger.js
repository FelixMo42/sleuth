module.exports = function() {
    return function(data) {
        console.log(`crawled (${data.response.statusCode}) ${data.url.href}`)
    }
}