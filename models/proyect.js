// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Proyect = sequelize.define("Proyect", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true,
  },
  presupuesto:{
    type:DataTypes.FLOAT,
    allowNull: false,
    unique:false,
  },
  cliente:{
    type:DataTypes.STRING,
    allowNull: false,
    unique:false,
  },
  fechaInicio:{
    type:DataTypes.DATEONLY,
    allowNull: false,
    unique:false,
  },
  fechaEntrega:{
    type:DataTypes.DATEONLY,
    allowNull: false,
    unique:false,
  },
  estado:{
    type:DataTypes.BOOLEAN,
    allowNull: false,
  },
});
module.exports = Proyect;