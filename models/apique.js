// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Apique = sequelize.define("Apique", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  informeNum: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cliente:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  tituloObra:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  localizacion:{
    type:DataTypes.STRING,
    allowNull: false,
    
  },
albaranNum:{
    type:DataTypes.STRING,
    allowNull: false,
    unique:true,
  },
  fechaEjecucionInicio:{
    type:DataTypes.DATEONLY,
    allowNull:false,

  },
  fechaEjecucionFinal:{
    type:DataTypes.DATEONLY,
    allowNull:false,
  },
  fechaEmision:{
    type:DataTypes.DATEONLY,
    allowNull:false,
  },
  tipo:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  operario:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  largoApique:{
type:DataTypes.FLOAT,
allowNull:true,
  },
  anchoApique:{
    type:DataTypes.FLOAT,
    allowNull:true,
  },
  profundidadApique:{
    type:DataTypes.FLOAT,
    allowNull:true, 
  },
   imagenes: {
          type: DataTypes.JSON,
          allowNull: false,
      },
      observaciones:{
        type:DataTypes.STRING,
        allowNull:true,
      },
 
});
module.exports = Apique;