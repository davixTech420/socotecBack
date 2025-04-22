// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const User = require("./user");
const Inventory = require("./inventory");

const AssignmentPPE = sequelize.define("AssignmentPPE", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  inventoryId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references:{
        model:Inventory,
        key:"id",
        foreignKey : "inventoryId"
    },
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
asignadorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key:'id',
      foreignKey:'asignadorId'
    },
},
  fechaConfirmacion: {
    allowNull: true,
    type: DataTypes.DATEONLY,
  },
  fechaRetorno: {
    type: DataTypes.DATEONLY,
    allowNull: true,
},
  fotoppe: {
    allowNull: true,
    type: DataTypes.STRING,
    unique: true
  },
  estado: {
    type: DataTypes.ENUM("Asignado","Confirmado","Devuelto"),
    defaultValue:"Asignado",
    allowNull: false,
  }
});

module.exports = AssignmentPPE;
