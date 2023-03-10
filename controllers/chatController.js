const db = require('../models')
const Chat = db.Chat
const User = db.User
const { Op } = require('sequelize')
const helpers = require('../_helpers')


const chatController = {
  getChats: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const chattingTo = Number(req.params.chatter_id)
      const chatter = await User.findByPk(chattingTo)

      let chats = await Chat.findAll({
        where: {
          [Op.or]: [
            { userId, chattingTo },
            { userId: chattingTo, chattingTo: userId }
          ]
        },
        order: [['createdAt', 'ASC']]
      })

      if (!chatter) {
        return res.status(404).json({ status: 'error', message: '無此使用者，請重新查詢！' })
      } else if (userId === chattingTo) {
        return res.status(403).json({ status: 'error', message: '無效的操作，請重新確認！' })
      }

      chats = chats.map(chat => {
        return {
          isUserMsg: chat.userId === userId ? true : false,
          chatterAvatar: chat.userId === userId ? null : chatter.avatar,
          chatDetail: chat.chatDetail,
          createdAt: chat.createdAt
        }
      })

      return res.status(200).json(chats)
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  postChat: async (req, res, next) => {
    try {
      const { content, chatter_id } = req.body
      const chattingTo = Number(chatter_id)
      let chatter = await User.findByPk(chattingTo)

      if (chattingTo === helpers.getUser(req).id) {
        return res.status(403).json({ status: 'error', message: '無效的操作，請重新確認！' })
      }
      if (!chatter) {
        return res.status(400).json({ statis: 'error', message: '無此使用者，請重新確認！' })
      }
      if (!content) {
        return res.status(400).json({ status: 'error', message: '輸入框為空，請重新輸入！' })
      }

      await Chat.create({
        userId: helpers.getUser(req).id,
        chattingTo,
        chatDetail: content
      })
      return res.status(201).json({ status: 'success', message: '聊天室內容更新成功！' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}

module.exports = chatController