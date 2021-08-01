const express = require('express')
const helpers = require('./_helpers');

const app = express()
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)