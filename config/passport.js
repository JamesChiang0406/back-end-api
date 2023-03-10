const db = require('../models')
const User = db.User
const passport = require('passport')

//JWT
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'alphacamp'

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    raw: true,
    include: [
      { model: db.Tweet, as: 'LikedTweets' },
      { model: db.Tweet, as: 'RepliedTweets' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' }
    ]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport