const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User
const { Op } = require('sequelize')
const helpers = require('../_helpers')

const userController = {
  // 登入
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account } })

      if (!account || !password) {
        return res.status(400).json({ status: 'error', message: '帳號或密碼未輸入！' })
      }
      if (!user) {
        return res.status(401).json({ status: 'error', message: '此帳號未註冊，請重新輸入！' })
      }
      if (user.role !== 'user') {
        return res.status(403).json({ status: 'error', message: '此帳號未授權登入，請重新輸入！' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼輸入錯誤，請重新確認！' })
      }

      const payload = { id: user.id }
      const JWT_SECRET = 'alphacamp'
      const token = jwt.sign(payload, JWT_SECRET)
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
          role: user
        }
      })

    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  // 註冊
  register: async (req, res, next) => {
    try {
      const { account, name, email, password, passwordCheck } = req.body
      const users = await User.findAll({ where: { [Op.or]: [{ account }, { email }] } })

      if (!account || !name || !email || !password || !passwordCheck) {
        return res.status(400).json({ status: 'error', message: '有欄位未填寫，請再次確認！' })
      }
      if (password !== passwordCheck) {
        return res.status(400).json({ status: 'error', message: '密碼確認不符，請再次確認！' })
      }
      if (users.length) {
        return res.status(400).json({ status: 'error', message: '帳號或信箱已存在，請重新輸入！' })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        role: user
      })

      return res.status(200).json({ status: 'success', message: '帳號創立成功！' })

    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  // 單一使用者資料
  getUser: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.user_id)

      if (!user) {
        return res.status(404).json({ status: 'error', message: '無此使用者，請再次確認！' })
      }

      // 回傳資料
      return res.status(200).json(user)
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  //修改使用者資料
  putUser: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const id = Number(req.params.user_id)
      const { account, name, email, password, passwordCheck } = req.body
      const users = await User.findAll({
        where: {
          [Op.or]: [{ account }, { email }],
          [Op.not]: [{ id: userId }]
        }
      })

      if (userId !== id) {
        return res.status(403).json({ status: 'error', message: '無法編輯其它使用者的資料！' })
      }
      if (password !== passwordCheck) {
        return res.status(400).json({ status: 'error', message: '密碼確認不符，請再次確認！' })
      }
      if (users.length) {
        return res.status(409).json({ status: 'error', message: '帳號或電子郵件已存在，請重新輸入！' })
      }

      const user = await User.findByPk(userId)
      const updateData = { account, name, email, password, passwordCheck }
      await user.update(updateData)
      return res.status(200).json({ status: 'success', message: '個人資料更新成功！' })

    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}

module.exports = userController