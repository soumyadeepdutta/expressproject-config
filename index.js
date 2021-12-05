const express = require("express");
const toobusy = require("toobusy-js")
const morgan = require('morgan')
const svgCaptcha = require("svg-captcha")
const dotenv = require("dotenv");
const { resolve } = require("path")
const { join } = require("path")
const { createWriteStream } = require("fs");
const helmet = require("helmet");

dotenv.config({ path: resolve(__dirname + `/env/${process.env.NODE_ENV}.env`) })
const app = express()


app.use(morgan("combined", { stream: createWriteStream(join(__dirname, 'access.log')) }))
app.use(helmet())
app.use(function (req, res, next) {
    if (toobusy()) {
        // log if you see necessary
        return res.send(503, "Server Too Busy");
    } else {
        next();
    }
});
app.use(express.json({ limit: '2kb' }))

require('./start/routes')(app)

app.get('/captcha', function (req, res) {
    const captcha = svgCaptcha.create();
    res.status(200).json({ data: captcha.data, text: captcha.text });
});

app.use("*", (req, res) => {
    return res.status(404).send('not found')
})
app.use(function (error, req, res, next) {
    console.log(error.message);
    return res.status(500).send('something went wrong!')
})


const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`server started ${process.env.NODE_ENV} ${PORT}`); })