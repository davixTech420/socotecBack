// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const User = require('./user');
const Proyect = require('./proyect');
const Group = require("./group");

const UsersGroup = sequelize.define("UsersGroup", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key:'id',
      foreignKey:'userId'
    },
},
groupId: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: Group,
    key:'id',
    foreignKey:'groupId'
  },
}
});

module.exports = UsersGroup;