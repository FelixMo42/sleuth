const _ = require("lodash")
const axios = require("axios").create({
    validateStatus: () => true
})

let bla = {
    url: "https://2019shell1.picoctf.com/problem/21882/flag",
    method: "GET",
    headers: [
        { name: "User-Agents", values: [ { value: '/' } ] },
    ],
    cookies: [
        { name: "admin", value: "true" },
        { name: "time", value: "1400" }
    ]
}

function buildHeaders(headers, cookies) {
    let headersObj = {}

    for (let header of headers) {
        headersObj[header.name] = headerValuesToString(header.values)
    }

    if (cookies !== undefined && cookies.length > 0) {
        headersObj["Cookie"] = cookiesToString(cookies)
    }

    return headersObj
}

function cookiesToString(cookies) {
    return cookies.map(({name, value}) => `${name}=${value}`).join("; ")
}

function headerValueToString({value, params}) {
    let str = value

    if (params != undefined) {
        str += ";" + params.join("; ")
    }
    
    return str
}


function headerValuesToString(values) {
    return values.map(headerValueToString).join(", ")
}

// sort

function sortBy(key) {
    return (a, b) => b[key] < a[key] ? 1 : -1
}

function empty(key) {
    return (obj) => key in obj && obj[key].length > 0
}

function sortRequest(request) {
    return {
        url: request.url,
        method: request.method,
        headers: request.headers.map(header => ({
            name: header.name,
            values: header.values.sort( sortBy("value") )
        })).sort( sortBy("name") ).filter( empty("values") ),
        cookies: request.cookies.sort( sortBy("name") )
    }
}

// function getRequest(request) {}

function requestToString(request, sort=true) {
    return require('json-stable-stringify')(
        sort ? sortRequest(request) : request
    )
}

function buildRequest(request) {
    return ({
        url: request.url,
        method: request.method,
        headers: buildHeaders(request.headers, request.cookies)
    })
}

function quest(request) {
    return axios( buildRequest( sortRequest(request) ) )
}

// tostring

quest(bla).then((response) => console.log(response.data))

// tostring

// console.log( buildRequest(sortRequest(bla)) )