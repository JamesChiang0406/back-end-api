const { sequelize } = require('../models')
const { Op } = require('sequelize')
const db = require('../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../_helpers')

const followshipController = {
  getRecommendList: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      let users = await User.findAll({
        where: {
          role: 'user',
          [Op.not]: [{ id: userId }]
        },
        include: [
          { model: User, as: 'Followers' }
        ],
        attributes: {

          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM  Followships WHERE Followships.followingId = User.id)'), 'followCount'
            ]
          ]
        },
        order: [[sequelize.literal('followCount'), 'DESC']],
        limit: 10
      })

      users = users.map(user => {
        let followersId = user.Followers.map(item => item.id)
        return {
          id: user.id,
          name: user.name,
          account: user.account,
          avatar: user.avatar,
          isFollowing: followersId.includes(userId)
        }
      })

      return res.status(200).json(users)
    } catch (error) {
      console.log(error)
      next(error)
    }
  },

  addFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.body.id
      let followingObject = await User.findOne({ where: { id: followingId } })
      let followship = await Followship.findOne({ where: { followerId, followingId } })

      if (!followerId || !followingId || followingObject === null) {
        return res.status(404).json({ status: 'error', message: '使用者不存在，請重新確認！' })
      }
      if (followerId === Number(followingId)) {
        return res.status(403).json({ status: 'error', message: '不可跟隨自己，請重新確認！' })
      }
      if (followship) {
        return res.status(403).json({ status: 'error', message: '跟隨已存在，請重新確認！' })
      }

      await Followship.create({
        followerId, followingId
      })
      return res.status(201).json({ status: 'success', message: '跟隨成功！' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      let followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.id
        }
      })

      if (followship === null) {
        return res.status(404).json({ status: 'error', message: '此對象未追蹤，請重新確認！' })
      }

      await followship.destroy()
      return res.status(200).json({ status: 'success', message: '取消跟隨成功！' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  getFollowers: async (req, res, next) => {
    try {
      // 取得資料 & 錯誤處理
      let data = await User.findByPk(req.params.user_id, {
        include: [
          { model: User, as: 'Followers' }
        ]
      })

      if (!data) {
        return res.status(404).json({ status: 'error', message: '沒有相關資料，請稍後再試！' })
      }

      // 取得使用者追蹤資料
      let userData = await User.findByPk(helpers.getUser(req).id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      userData = userData.Followings.map(user => user.id)

      data = data.Followers.map(user => {
        return {
          id: user.id,
          account: user.account,
          name: user.name,
          avatar: user.avatar,
          introduction: user.introduction,
          isUserFollowing: userData.includes(user.id)
        }
      })

      return res.status(200).json(data)
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  getFollowings: async (req, res, next) => {
    try {
      // 取得資料 & 錯誤處理
      let data = await User.findByPk(req.params.user_id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })

      if (!data) {
        return res.status(404).json({ status: 'error', message: '沒有相關資料，請稍後再試！' })
      }

      // 取得使用者追蹤資料
      let userData = await User.findByPk(helpers.getUser(req).id, {
        include: [
          { model: User, as: 'Followings' }
        ]
      })
      userData = userData.Followings.map(user => user.id)

      data = data.Followings.map(user => {
        return {
          id: user.id,
          account: user.account,
          name: user.name,
          avatar: user.avatar,
          introduction: user.introduction,
          isUserFollowing: userData.includes(user.id)
        }
      })

      return res.status(200).json(data)
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}

module.exports = followshipController