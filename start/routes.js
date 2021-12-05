const asyncMiddleware = require("../middlewares/async")

module.exports = function (app) {
    app.get('/api', (req, res) => {
        // console.log(req.ip);
        return res.send('ok\n')
    })

    app.post('/api', asyncMiddleware(async (req, res, next) => {
        throw new Error('throwing error')
        return res.send("post")
    }))
}