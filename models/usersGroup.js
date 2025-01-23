// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const User = require('./user');
const Proyect = require('./proyect');

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
  proyectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Proyect,
      key:'id',
      foreignKey:'proyectId'
    },
  }
});

module.exports = UsersGroup;