const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

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
cuentaOrigenId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
        
    }
},
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});