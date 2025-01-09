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
    type: DataTypes.ENUM("Ingeniero", "Director","Laboratorista"),
    allowNull: false,
  },
  permiso:{
    type:DataTypes.ENUM("Vacaciones","Medico","Personal"),
    allowNull: true,
  },
  fechaPermiso:{
    type:DataTypes.DATEONLY,
    allowNull:true ,
  },
  estadoPermiso: {
    type: DataTypes.ENUM("Aprovado","Pendiente","Rechazado"),
    allowNull: true,
  }
});

module.exports = Employee;