module.exports = function() {
    return function(data) {
        console.log(`crawled ${data.url.href}`)
    }
}