// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Hiring = sequelize.define("Hiring", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    allowNull: false,
    type: DataTypes.BIGINT,
    unique: true,
  },
  cargo: {
    allowNull: false,
    type: DataTypes.ENUM(
      "DirectorTalento",
      "Talento",
      "Directorsset",
      "Sset",
      "Ingeniero",
      "Director",
      "Laboratorista",
      "Auxiliar",
      "Arquitecto",
      "TeamLider",
      "Deliniante",
      "DirectorContable",
      "Contador"
    ),
    defaultValue: "Auxiliar",
  },
  tipoContrato: {
    allowNull: false,
    type: DataTypes.ENUM(
      "Fijo",
      "Indefinido",
      "Prestación Servicios",
      "Practicante"
    ),
    defaultValue: "Fijo",
  },
  estado: {
    allowNull: false,
    type: DataTypes.ENUM(
      "Postulado",
      "CV Aprobado",
      "Entrevista 1",
      "Entrevista 2",
      "Prueba Técnica",
      "Oferta Enviada",
      "Contrato Firmado",
      "Rechazado"
    ),
    defaultValue:"Postulado",
  },
salario: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cita:{
    allowNull:true,
    type:DataTypes.DATE,
  },
  nota:{
    allowNull:true,
    type:DataTypes.STRING,
  }
});

module.exports = Hiring;
