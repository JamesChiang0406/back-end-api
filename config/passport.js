const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

/* passport strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },

  (req, username, password, cb) => {
    User.findOne({ where: { account, password } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_msg', '帳號或密碼輸入錯誤！'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_msg', '密碼輸入錯誤'))

      return cb(null, user)
    })
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: db.Tweet, as: 'LikedTweets' },
      { model: db.Tweet, as: 'RepliedTweets' },
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' }
    ]
  }).then(user => {
    return cb(null, user)
  })
})
*/

//JWT
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'alphacamp'

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
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