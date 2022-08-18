const fs = require('fs')

fs.readFile('/Users/sergiosmacbook/Websites/geoguesser/test.txt', 'utf8' , (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(data)
})