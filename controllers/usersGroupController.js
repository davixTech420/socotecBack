const User = require("../models/user");
const Proyect = require("../models/proyect");
const Group = require("../models/group");
const UsersGroup = require("../models/usersGroup");

exports.getUsersGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const usersGroup = await UsersGroup.findAll({ where: { proyectId: id } });
    res.status(200).json(usersGroup);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios del grupo" });
  }
};