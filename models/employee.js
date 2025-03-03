// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const User = require('./user');

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    unique:true,
    references: {
      model: User,
      key:'id',
      foreignKey:'userId'
    },
},
  cargo: {
    type: DataTypes.ENUM("Talento","Ingeniero", "Director","Laboratorista","Auxiliar","Arquitecto"),
    defaultValue: "Auxiliar",
    allowNull: false,
  },
});

module.exports = Employee;