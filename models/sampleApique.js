// models/sampleApique
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");
const Apique = require('./apique');


const sampleApique = sequelize.define("sampleApique", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  apiqueId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Apique,
      key:'id',
      foreignKey:'apiqueId'
    },
},
sampleNum: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
profundidadInicio:{
    type:DataTypes.FLOAT,
    allowNull:false,
},
profundidadFin:{
    type:DataTypes.FLOAT,
    allowNull:false,
},
espresor:{
    type:DataTypes.FLOAT,
    allowNull:false,
},
estrato:{
    type:DataTypes.STRING,
    allowNull:false,
},
descripcion:{
    type:DataTypes.STRING,
    allowNull:false,
},
tipoMuestra:{
type:DataTypes.STRING,
allowNull:false,
},
pdcLi:{
  type:DataTypes.STRING,
  allowNull:true,
},
pdcLf:{
type:DataTypes.STRING,
allowNull:true,
},
pdcGi:{
  type:DataTypes.STRING,
  allowNull:true,
}
});

module.exports = sampleApique;