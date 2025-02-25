const Group = require("../models/group");
const User = require("../models/user");
const Employee = require("../models/employee");
const Proyect = require("../models/proyect");
const Permission = require("../models/permission");
const UsersGroup = require("../models/usersGroup");
const { Op } = require("sequelize");

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los grupos" });
  }
};


exports.createGroup = async (req, res) => {
  try {
    const { nombre, descripcion, usuarios } = req.body;

    const group = await Group.create({ nombre, descripcion, estado: true });
    const userGroups = await Promise.all(
      usuarios.map(userId => UsersGroup.create({ userId, groupId: group.id }))
    );
    res.status(200).json({ message: "Grupo creado correctamente", group });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el grupo", error });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { id } = req.params; // ID del grupo a actualizar
    const { nombre, descripcion, usuarios } = req.body;
    // Verificar si el grupo existe
    const group = await Group.findByPk(id);
    if (!group) return res.status(404).json({ error: "Grupo no encontrado" });
    // Actualizar los datos del grupo
    await group.update({ nombre, descripcion });
    // Obtener los usuarios actuales del grupo
    const currentUsers = await UsersGroup.findAll({ where: { groupId: id } });
    const currentUserIds = currentUsers.map((ug) => ug.userId);
    const usersToAdd = usuarios.filter((userId) => !currentUserIds.includes(userId));
    const usersToRemove = currentUserIds.filter((userId) => !usuarios.includes(userId));
    await Promise.all(usersToAdd.map((userId) => UsersGroup.create({ userId, groupId: id })));
    await UsersGroup.destroy({ where: { groupId: id, userId: usersToRemove } });
    res.status(200).json({ message: "Grupo actualizado correctamente", group });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el grupo", details: error.message });
  }
};


exports.deleteGroup = async (req, res) => {
  try {
    const id = req.params.id;
    if(await Proyect.findAll({where:{groupId:id}})){
      return res.status(400).json({ message: "No se puede eliminar el grupo porque tiene proyectos asociados" });
    }
    const userGroup = await UsersGroup.destroy({ where: { groupId: id } });
    const group = await Group.destroy({ where: { id } });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el grupo" });
  }
};



exports.activateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.update({ estado: true }, { where: { id } });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Error al activar el grupo" });
  }
}


exports.inactivateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.update({ estado: false }, { where: { id } });
    res.status(200).json(group);

  } catch (error) {
    res.status(500).json({ error: "Error al inactivar el grupo" });
  }
}

//endpoint para obtener los usuarios de un grupo
exports.getUsersGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const usersGroup = await UsersGroup.findAll({ where: { proyectId: id } });
    res.status(200).json(usersGroup);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios del grupo" });
  }
};



//obtener los grupos activos sin proyectos
exports.getGroupNotProyect = async (req,res) => {
try{
 // Paso 1: Obtener todos los groupId que están asociados a un proyecto
 const gruposConProyecto = await Proyect.findAll({
  attributes: ['groupId'], // Solo nos interesa el groupId
  where: {
    groupId: { [Op.not]: null } // Filtramos solo los proyectos con groupId no nulo
  },
  raw: true // Para obtener un array plano de resultados
});

// Extraemos los groupId únicos
const groupIdsConProyecto = gruposConProyecto.map(proyecto => proyecto.groupId);

// Paso 2: Buscar los grupos que no están en la lista de groupIdsConProyecto
const gruposSinProyecto = await Group.findAll({
  where: {
    id: { [Op.notIn]: groupIdsConProyecto },
    estado: true // Filtramos los grupos que no tienen proyectos
  }
});

res.json(gruposSinProyecto);
}catch(error){
  res.status(500).json({ message: "ha ocurrido un error" ,error});  
}
}