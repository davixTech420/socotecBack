// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const Environmental = require("./environmental");

const condicionsEnvironmental = sequelize.define("condicionsEnvironmental", {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  fechaEjecucion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique:false,
  },
  hora:{
    type:DataTypes.TIME,
    allowNull: false,
    unique:false,
  },
  temperatura:{
    type:DataTypes.FLOAT,
    allowNull: false,
    unique:false,
  },
  humedad:{
    type:DataTypes.INTEGER,
    allowNull: false,
    unique:false,
  },
firma:{
    type:DataTypes.STRING,
    allowNull: false,
    unique:false,
  },
  observaciones:{
    type:DataTypes.STRING,
    allowNull: true,
  },
  idEnvironmental:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
        model:Environmental,
        key:"id",
        foreignKey:"idEnvironmental"
    },
  }
});
module.exports = condicionsEnvironmental;