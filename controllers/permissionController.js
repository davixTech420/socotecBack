const { Op } = require("sequelize");
const Permission = require('../models/permission');
const User = require("../models/user");
const UserGroup = require("../models/usersGroup");


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
    const {id }  = req.params;
    const { solicitanteId, aprobadorId, tipoPermiso, fechaInicio, fechaFin,estado } = req.body;
    const permission = await Permission.update({ solicitanteId, aprobadorId, tipoPermiso, fechaInicio, fechaFin,estado } , { where : {id}});
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


exports.getMyPermissions = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const permisos = await Permission.findAll({ where: { solicitanteId: user.id } });
    res.status(200).json(permisos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los permisos' });
  }
};


exports.getPermissionsByGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Buscar los grupos a los que pertenece el usuario
    const userGroups = await UserGroup.findAll({
      where: { userId: id },
      attributes: ['groupId'],
    });

    if (!userGroups.length) {
      return res.status(404).json({ message: 'El usuario no pertenece a ningún grupo' });
    }

    const groupIds = userGroups.map((ug) => ug.groupId);
    // 2️⃣ Buscar todos los usuarios que pertenecen a los mismos grupos
    const usersInGroups = await UserGroup.findAll({
      where: { groupId: groupIds },
      attributes: ['userId'],
      group: ['userId'],
    });

    const userIds = usersInGroups.map((ug) => ug.userId);

    // 3️⃣ Obtener los permisos de esos usuarios
    const permissions = await Permission.findAll({
      where: { solicitanteId: userIds },
    });
    res.status(200).json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los permisos',error });
  }
};