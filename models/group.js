// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
    unique:true,
},
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado:{
    type:DataTypes.BOOLEAN,
    allowNull: false,
  }
});

module.exports = Group;