module.exports = function() {
    return function(response) {
        console.log(`crawled (${response.status}) ${response.url}`)
    }
}