const db = require('../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../_helpers')

const followshipController = {
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
          followingId: req.body.id
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
  }
}

module.exports = followshipController