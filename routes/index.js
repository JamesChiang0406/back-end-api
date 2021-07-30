const apiAdmin = require('./apiAdmin')
const api = require('./api')

module.exports = app => {
  app.use('/api/admin', apiAdmin)
  app.use('/api', api)
}