// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const Group = require("./group");

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
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
    
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
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Group,
      key:'id',
      foreignKey:'groupId'
    },
},
});
module.exports = Proyect;