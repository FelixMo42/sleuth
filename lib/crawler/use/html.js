const cheerio = require('cheerio')

module.exports = function() {
    return function(data) {
        let $ = cheerio.load(data.body)

        $("[href]").each((_, el) => {
            data.crawler.add( new URL( $(el).attr("href"), data.url.href ) )
        })

        $("[src]").each((_, el) =>
            data.crawler.add( new URL($(el).attr("src"), data.url.href) )
        )    
    }
}