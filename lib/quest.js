const _ = require("lodash")
const axios = require("axios").create({
    validateStatus: () => true
})

let url = new URL("https://2019shell1.picoctf.com/problem/21882/flag")
let method = "GET"

let bla = {
    url: url.href,
    method: method,
    headers: [
        { name: "User-Agents", values: [ { value: '/' } ] },
        { name: "Accept", values: [ { value: '*/(' } ] },
        { name: "Cookie", values: [ { value: 'C' }, { value: 'A' } ] }
    ]
}

function buildHeaders(headers) {
    let headersObj = {}

    for (let header of headers) {
        headersObj[header.name] = buildHeaderValues(header.values)
    }

    return headersObj
}

function buildHeaderValues(values) {
    return values.map(
        ({value, params}) => value + (params != undefined ? params : "")
    ).join(", ")
}

// sort

function sortBy(key) {
    return (a, b) => b[key] < a[key] ? 1 : -1
}

function buildObj(array) {

}

function sortRequest(request) {
    return {
        url: request.url,
        method: request.method,
        headers: request.headers.map(header => ({
            name: header.name,
            values: header.values.sort( sortBy("value") )
        })).sort( sortBy("name") )
    }
}

// function getRequest(request) {}

function requestToString(request, sort=true) {
    return require('json-stable-stringify')(
        sort ? sortRequest(request) : request
    )
}

function zToS(request) {
    return ({
        url: request.url,
        method: request.method,
        headers: buildHeaders(request.headers)
    })
}

// tostring

console.log( zToS(bla) )