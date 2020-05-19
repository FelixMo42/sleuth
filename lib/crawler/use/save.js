const fs = require("fs-extra")

module.exports = function(dir="./out/scrape") {
    fs.emptyDir(dir)

    return function (response) {
        // if (response.status == 404) {
        //     return
        // }

        // let extra = response.url.charAt(response.url.length - 1) == "/" ? "__index__" : ""
        // return fs.outputFile(`${dir}/${data.url.hostname}${data.url.pathname}${extra}`, data.body)
    }
}