const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminController = {
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account } })

      // 錯誤處理
      if (!account || !password) {
        return res.status(400).json({ status: 'error', message: '欄位為空，請重新登入！' })
      }
      if (!user) {
        return res.status(401).json({ status: 'error', message: '使用者不存在，請重新登入！' })
      }
      if (user.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: '未授權的動作，請重新登入！' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤，請重新確認！' })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}

module.exports = adminController