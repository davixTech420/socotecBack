const { Op } = require("sequelize");
const Account = require('../models/account');
const Motion = require("../models/motion");

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
    const { nombreCuenta, tipoCuenta, entidad, saldo } = req.body;
    const account = await Account.create({
      nombreCuenta,
      tipoCuenta,
      entidad,
      saldo,
      estado: true,
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
    const { nombreCuenta, tipoCuenta, entidad, saldo} = req.body;
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }
    account.nombreCuenta = nombreCuenta;
    account.tipoCuenta = tipoCuenta;
    account.entidad = entidad;
    account.saldo = saldo;
    account.estado = estado;
    await account.save();
    res.status(200).json({ message: "Cuenta actualizada" });
}catch (error) {
    res.status(500).json(error);
  }
}


exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }
    if (account.estado === true) {
      return res.status(400).json({ message: "Cuenta no puede ser eliminada porque esta activada" });
    }
    if (await Motion.findAll({ where: { [Op.or]: [
      { cuentaEmisoraId: id },
      { cuentaReceptoraId: id },
    ], } })) {
      return res.status(400).json({ message: "Cuenta no puede ser eliminada porque tiene movimientos asociados" });
    }
    await account.destroy(id);
    res.status(200).json({ message: "Cuenta eliminada" });
  } catch (error) {
    res.status(500).json(error);
  }
}


exports.inactiveAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }
    account.estado = false;
    await account.save();
    res.status(200).json({ message: "Cuenta desactivada" });
  } catch (error) {
    res.status(500).json(error);
  }
}
