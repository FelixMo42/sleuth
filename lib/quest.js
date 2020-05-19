const o = require("sleuth/o")
const axios = require("axios").create({ validateStatus: () => true })

// build

function buildRequest(request) {
    return ({
        url: request.url,
        method: request.method,
        headers: buildHeaders(request.headers, request.cookies)
    })
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

// make

function makeRequest(params, defaults) {
    if (typeof params == "string") {
        return {
            url: params,
            method: defaults.defaultMethod,
            headers: defaults.defaultHeaders,
            cookies: defaults.defaultCookies
        }
    }
}

// to string

function requestToString(request) {    
    let str = `${request.method} ${request.url}\n`

    str += headersToString(request.headers, request.cookies)

    return str
}

function headersToString(headers, cookies) {
    let str = ""

    str += headers.map(headerToString).join("\n")

    if (cookies !== undefined && cookies.length > 0) {
        str += `Cookie: ${cookiesToString(cookies)}`
    }

    return str
}

function headerToString({name, values}) {
    return `${name}: ${headerValuesToString(values)}`
}

function cookiesToString(cookies) {
    return cookies.map(({name, value}) => `${name}=${value}`).join("; ")
}

function headerValuesToString(values) {
    return values.map(headerValueToString).join(", ")
}

function headerValueToString({value, params}) {
    let str = value

    if (params != undefined) {
        str += ";" + params.join("; ")
    }
    
    return str
}

// to json

function requestToJson(request, sort=true) {
    return require('json-stable-stringify')(
        sort ? sortRequest(request) : request
    )
}

// sort function

function sortRequest(request) {
    return {
        url: request.url,
        method: request.method,
        headers: request.headers.map(header => ({
            name: header.name,
            values: header.values.sort( o.sort.by("value") )
        })).sort( o.sort.by("name") ).filter( o.has.any("values") ),
        cookies: request.cookies.sort( o.sort.by("name") )
    }
}

// main function

function quest(request) {
    return axios( buildRequest( request ) ).then(response => ({
        url: request.url,
        method: request.method,
        status: response.status,
        body: response.data
    }))
}

// export

module.exports = quest

quest.sortRequest = sortRequest
quest.toJson = requestToJson
quest.make = makeRequest