const Permission = require('../models/permission');
const User = require("../models/user");

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los permisos' });
  }
};

exports.createPermission = async (req, res) => {
  try {
   
    const { solicitanteId, aprobadorId, tipoPermiso, fechaInicio, fechaFin } = req.body;
    const permission = await Permission.create({ solicitanteId, aprobadorId, tipoPermiso, fechaInicio, fechaFin, estado: 'Pendiente' });

    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el permiso',error:error });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const { solicitanteId, aprobadorId, tipoPermiso, fechaInicio, fechaFin } = req.body;
    const permission = await Permission.update({ solicitanteId, aprobadorId, tipoPermiso, fechaInicio, fechaFin });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el permiso' });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const id = req.params.id;
    const permission = await Permission.destroy({ where: { id } });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el permiso' });
  }
};

exports.activePermission = async (req, res) => {
  try {
    const id = req.params.id;
    const permission = await Permission.update({ estado: true }, { where: { id } });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Error al activar el permiso' });
  }
};

exports.inactivePermission = async (req, res) => {
  try {
    const id = req.params.id;
    const permission = await Permission.update({ estado: false }, { where: { id } });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Error al desactivar el permiso' });
  }
};