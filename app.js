const express = require('express')
const flash = require('connect-flash')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(flash())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes')(app)