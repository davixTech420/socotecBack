const Hiring = require("../models/hiring");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { Op } = require("sequelize");

exports.getHiring = async (req, res) => {
  try {
    const hiring = await Hiring.findAll();
    res.status(200).json(hiring);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ha Ocurrido Un Error Al Obtener Los Candidatos",
        error,
      });
  }
};
exports.createHiring = async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      cargo,
      tipoContrato,
      estado,
      salario,
      cita,
      nota,
    } = req.body;

    const hiring = await Hiring.create({nombre,email,telefono,cargo,tipoContrato,estado,salario,cita,nota})
    res.status(201).json({message:"Se Ha Creado Con Exito",hiring});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Crear Candidato" });
  }
};


exports.updateHiring = async (req,res) => {
    try {
        const {id}  = req.params;
        const {
            nombre,
            email,
            telefono,
            cargo,
            tipoContrato,
            estado,
            salario,
            cita,
            nota,
          } = req.body;
          
          const hiring = await Hiring.update({ nombre,
            email,
            telefono,
            cargo,
            tipoContrato,
            estado,
            salario,
            cita,
            nota},{where:{id}});
            res.status(200).json({message:"Se Ha Actulizado Con Exito", hiring });
        
    } catch (error) {
        res.status(500).json({message:"Ha Ocurrido Un Error Al Actualiza Candidato"});
    }
}


exports.deleteHiring = async (req,res) => {
    try {
        const { id } = req.params;
        const hiring = await Hiring.destroy({where:{id}});
        res.status(200).json({message:"Se Ha Eliminado Con Exito"});
    } catch (error) {
        res.status(500).json({message:"Ha Ocurrido Un Error Al Eliminar Candidato",error});
    }
}