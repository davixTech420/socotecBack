// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Environmental = sequelize.define("Environmental", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  norma: {
    type: DataTypes.STRING  ,
    allowNull: false,
    unique: false,
  },
  especificacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  rangoMedicion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  lugarMedicion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conclusion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Environmental;
