const express = require('express')
const flash = require('connect-flash')
const cors = require('cors')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.port

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(flash())

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

require('./routes/index')(app)
require('./socket/socket')(server)