const cheerio = require('cheerio')

module.exports = function({addLinks=true, getForms=true}={}) {
    return function(data) {
        let $ = cheerio.load(data.body)

        if (addLinks) {
            $("[href]").each((_, el) => {
                data.crawler.add( new URL( $(el).attr("href"), data.url.href ) )
            })

            $("[src]").each((_, el) =>
                data.crawler.add( new URL($(el).attr("src"), data.url.href) )
            )
        }

        if (getForms) {
            $("form").each((_, el) => {
                let action = $(el).attr("action") || ""
                let method = $(el).attr("method") || "POST"

                let paramaters = []

                $("input[name]", el).each((_, el) => {
                    paramaters.push({
                        name: $(el).attr("name"),
                        type: $(el).attr("type"),
                        default: $(el).attr("value")
                    })
                })

                console.log(action, method, paramaters)
            })
        }
    }
}