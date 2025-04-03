// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const User = require('./user');

const Ticket = sequelize.define("Ticket", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key:'id',
      foreignKey:'userId'
    },
},
sitio:{
    type: DataTypes.ENUM("Oficina Principal","Laboratorio"),
    allowNull:false,
},
remoto:{
    type:DataTypes.STRING,
    allowNull:true
},
descripcion:{
    type: DataTypes.STRING,
    allowNull: false,
},
estado:{
    type: DataTypes.ENUM("En Proceso","Resuelto"),
    allowNull: false,
},
});

module.exports = Ticket;