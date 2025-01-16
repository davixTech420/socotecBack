// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Inventory = sequelize.define("Inventory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  nombreMaterial: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
  },
  descripcion:{
    type:DataTypes.STRING,
    allowNull: false,
    unique:false,
  },
  cantidad:{
    type:DataTypes.INTEGER,
    allowNull: false,
    unique:false,
  },
  unidadMedida:{
    type:DataTypes.STRING,
    allowNull: false,
    unique:false,
  },
precioUnidad:{
    type:DataTypes.FLOAT,
    allowNull: false,
    unique:false,
  },
  estado:{
    type:DataTypes.BOOLEAN,
    allowNull: false,
  },
});
module.exports = Inventory;