module.exports = function() {
    return function(data) {
        console.log(`visiting ${data.url.href}`)
    }
}