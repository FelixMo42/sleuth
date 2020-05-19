module.exports = {
    sort: {
        by: (key) => (a, b) => b[key] < a[key] ? 1 : -1
    },
    has: {
        any: (key) => (obj) => key in obj && obj[key].length > 0
    }
}