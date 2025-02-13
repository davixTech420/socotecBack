const Account = require('../models/account');
const Permission = require("../models/permission");
const { getUsersGroup } = require("./usersGroupController");

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json(error);
  }
}

//endpoint para crear una cuenta
exports.createAccount = async (req, res) => {
  try {
    const { nombreMaterial, descripcion, cantidad, unidadMedida, precioUnidad } = req.body;
    const account = await Account.create({
      nombreMaterial,
      descripcion,
      cantidad,
      unidadMedida,
      precioUnidad,
    });
    res.status(201).json({ message: "Cuenta creada", account });
  } catch (error) {
    res.status(500).json(error);
  }
}

// endpoint para actualizar una cuenta
exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreMaterial, descripcion, cantidad, unidadMedida, precioUnidad } = req.body;
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }
    account.nombreMaterial = nombreMaterial;
    account.descripcion = descripcion;
    account.cantidad = cantidad;
    account.unidadMedida = unidadMedida;
    account.precioUnidad = precioUnidad;
    await account.save();
    res.status(200).json({ message: "Cuenta actualizada" });
}catch (error) {
    res.status(500).json(error);
  }
}


