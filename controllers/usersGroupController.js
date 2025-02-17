const User = require("../models/user");
const Proyect = require("../models/proyect");
const Group = require("../models/group");
const UsersGroup = require("../models/usersGroup");
const { Op } = require("sequelize");

exports.getUsersGroup = async (req, res) => {
  try {
    const { id } = req.params;

    // Paso 1: Obtener los userIds de los usuarios en el grupo
    const usersGroup = await UsersGroup.findAll({
      where: { groupId: id },
      attributes: ['userId'], // Solo necesitamos los userIds
      raw: true, // Devuelve datos simples, no instancias de Sequelize
    });

    // Extraer los userIds
    const userIds = usersGroup.map(ug => ug.userId);

    // Paso 2: Obtener los usuarios activos correspondientes a los userIds
    const users = await User.findAll({
      where: {
        id: userIds,
      },
      attributes: ['id', 'nombre', 'email'], // Solo los campos necesarios
      raw: true, // Devuelve datos simples
    });

    // Paso 3: Combinar la información
    const response = usersGroup.map(ug => {
      const user = users.find(u => u.id === ug.userId);
      return {
        ...ug,
        User: user || null, // Si no se encuentra el usuario, se devuelve null
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios del grupo" });
  }
};



//obtener los usuarios sin grupo
exports.getUsersNotGroup = async (req, res) => {
  try {
    // Obtener todos los userId que están en UsersGroup
    const usersInGroup = await UsersGroup.findAll({
      attributes: ["userId"],
      raw: true, // Retorna solo los datos sin envoltura de Sequelize
    });

    // Extraer userIds directamente en un array
    const userIdsInGroup = usersInGroup.map(({ userId }) => userId);

    // Obtener usuarios que NO están en el grupo usando una consulta directa
    const usersNotInGroup = await User.findAll({
      where: {
        id: { [Op.notIn]: userIdsInGroup.length ? userIdsInGroup : userIdsInGroup }, // Evita error si no hay usuarios en el grupo
        estado:true,
      },
    });

    res.status(200).json(usersNotInGroup);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios", details: error.message });
  }
};


exports.createUsersGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const usersGroup = await UsersGroup.create({ userId, groupId });
    res.status(200).json(usersGroup);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario del grupo" });
  }
};




exports.deleteUsersGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const usersGroup = await UsersGroup.findOne({ where: { userId: id } });
    if (!usersGroup) {
      res.status(404).json({ error: "No se encontro el usuario" });
    } else {
      await usersGroup.destroy({where: { userId: id }});
      res.status(200).json({ message: "Usuario eliminado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};




exports.updateUsersGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, groupId } = req.body;
    const response = await UsersGroup.update({
      userId,
      groupId
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar los usuarios en el grupo" });
  }

}