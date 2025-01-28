const User = require("../models/user");
const Proyect = require("../models/proyect");
const Group = require("../models/group");
const UsersGroup = require("../models/usersGroup");

exports.getUsersGroup = async (req, res) => {
  try {
    const { id } = req.params;
    // Paso 1: Obtener los 'userId' de los usuarios en el grupo
    const usersGroup = await UsersGroup.findAll({ where: { groupId: id } });
    const userIds = usersGroup.map(ug => ug.userId);
    const users = await User.findAll({
      where: { id: userIds, estado: true },
      attributes: ['id', 'nombre', 'email']
    });
    const response = usersGroup.map(ug => {
      const user = users.find(u => u.id === ug.userId);
      return {
        ...ug.toJSON(),
        User: user ? user.toJSON() : null
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los usuarios del grupo" });
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
    const usersGroup = await UsersGroup.findOne({ where: { id } });
    if (!usersGroup) {
      res.status(404).json({ error: "No se encontro el usuario" });
    } else {
      await usersGroup.destroy();
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