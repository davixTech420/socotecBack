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
descripcion:{
    type:DataTypes.STRING,
    allowNull:false,
},
tipoMuestra:{
type:DataTypes.STRING,
allowNull:false,
},
});

module.exports = sampleApique;