// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const User = require('./user');

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  asignadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key:'id',
      foreignKey:'asignadoId'
    },
},
titulo:{
    type: DataTypes.STRING,
    allowNull: false,
},
descripcion:{
    type: DataTypes.STRING,
    allowNull: false,
},
estado:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
},
});

module.exports = Task;