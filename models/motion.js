const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const Account = require("../models/account");

const Motion = sequelize.define("Motion", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  tipoMovimiento:{
    type:DataTypes.ENUM("transaccion","presupuesto","proyecto"),
    allowNull:false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  monto:{
type:DataTypes.REAL,
allowNull:false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cuentaEmisoraId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Account,
      key:'id',
      foreignKey:'cuentaEmisoraId'
    },
  },
  cuentaReceptoraId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Account,
      key:'id',
      foreignKey:'cuentaReceptoraId'
    },
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Motion;