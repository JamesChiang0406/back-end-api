'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      chat.belongsTo(models.User)
    }
  };
  chat.init({
    userId: DataTypes.STRING,
    chatDetail: DataTypes.STRING,
    chattingTo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'chat',
  });
  return chat;
};