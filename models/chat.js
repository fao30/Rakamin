"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.belongsTo(models.User, { foreignKey: "id_user" });
      Chat.belongsTo(models.Room, { foreignKey: "id_room" });
    }
  }
  Chat.init(
    {
      id_room: DataTypes.INTEGER,
      id_user: DataTypes.INTEGER,
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
