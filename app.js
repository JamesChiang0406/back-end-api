const express = require('express')
const flash = require('connect-flash')
const helpers = require('./_helpers');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)