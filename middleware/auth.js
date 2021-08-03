const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: 'Verification Failed！' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'Unauthorized Access！' })
  } else {
    return res.json({ status: 'error', message: 'Unauthorized Access！' })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}