const fs = require("fs-extra")

module.exports = function(dir="./out/scrape") {
    fs.emptyDir(dir)

    return function (data) {
        if (data.response.statusCode == 404) {
            return
        }

        let extra = data.url.pathname.charAt(data.url.pathname.length - 1) == "/" ? "__index__" : ""
        return fs.outputFile(`${dir}/${data.url.hostname}${data.url.pathname}${extra}`, data.body)
    }
}