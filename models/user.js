// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono:{
    type:DataTypes.STRING,
    unique:true,
    allowNull: false
  },
  email:{
    type:DataTypes.STRING,
    allowNull: false,
    unique:true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado:{
    type:DataTypes.BOOLEAN,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;