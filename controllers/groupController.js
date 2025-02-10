const Group = require("../models/group");
const User = require("../models/user");
const Employee = require("../models/employee");
const Permission = require("../models/permission");
const UsersGroup = require("../models/usersGroup");

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
    const { nombre, descripcion } = req.body;
    const group = await Group.create({ nombre, descripcion, estado:true });
    res.status(200).json({ message: "Grupo creado correctamente",group });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el grupo",error });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const {id} = req.params;
    const { nombre, descripcion } = req.body;
    const group = await Group.update({ nombre, descripcion }, { where: { id } });
    res.status(200).json({ message : "Grupo actualizado correctamente",group });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el grupo",error });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const id = req.params.id;
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
  }catch(error){
res.status(500).json({ error: "Error al activar el grupo" });
  }
}


exports.inactivateGroup = async (req, res) => {
    try{
      const {id} = req.params;
      const group = await Group.update({ estado: false }, { where: { id } });
      res.status(200).json(group);

    }catch(error){
        res.status(500).json({error : "Error al inactivar el grupo"});
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