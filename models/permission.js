// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const User = require('./user');


const Permission = sequelize.define("Permission", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  solicitanteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key:'id',
      foreignKey:'solicitanteId'
    },
},
  aprobadorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key:'id',
      foreignKey:'aprobadorId'
    },
  },
  tipoPermiso: {
    type: DataTypes.ENUM("Vacaciones","Medico","Personal"),
    defaultValue: "Personal",
    allowNull: false,
  },
  fechaInicio:{
    type:DataTypes.DATEONLY,
    allowNull:false,
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull:true,
  },
  estado:{
    type:DataTypes.ENUM("Pendiente","Aprobado","Rechazado"),
    defaultValue: "Pendiente",
    allowNull: false,
  }
});

module.exports = Permission;