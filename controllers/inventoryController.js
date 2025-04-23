const Inventory = require("../models/inventory");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.getInventory = async (req, res) => {
  try {
    const proyect = await Inventory.findAll();
    res.status(200).json(proyect);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el inventario" });
  }
};

exports.getActiveInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({ where: { estado: true } });
    res.status(200).json(inventory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Obtener El Equipo", error });
  }
};

exports.createInventory = async (req, res) => {
  try {
    const {
      nombreMaterial,
      descripcion,
      cantidad,
      unidadMedida,
      precioUnidad,
    } = req.body;

    if ((await Inventory.findAll({ where: { nombreMaterial } })).length > 0) {
      return res.status(400).json({ message: "El material ya existe" });
    }
    const inventory = await Inventory.create({
      nombreMaterial,
      descripcion,
      cantidad,
      unidadMedida,
      precioUnidad,
      estado: true,
    });
    res
      .status(200)
      .json({ message: "Registro de inventario creado", inventory });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear registro de inventario" + error });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const {
      nombreMaterial,
      descripcion,
      cantidad,
      unidadMedida,
      precioUnidad,
    } = req.body;
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) {
      res.status(404).json({ error: "No se encontro el registro" });
    }

    const inventoyExist = await Inventory.findOne({
      where: {
        [Op.or]: [{ nombreMaterial }],
        id: { [Op.ne]: req.params.id },
      },
    });
    if (inventoyExist) {
      return res.status(400).json({ message: "El material ya existe" });
    }

    inventory.update({
      nombreMaterial,
      descripcion,
      cantidad,
      unidadMedida,
      precioUnidad,
    });
    res.status(200).json({ message: "Registro actualizado", inventory });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el registro de inventario" + error });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const proyect = await Inventory.findByPk(id);
    if (!proyect) {
      res.status(404).json({ error: "No se encontro el registro" });
    }
    if (proyect.estado === true) {
      return res
        .status(400)
        .json({ message: "No se puede eliminar un material activo" });
    }
    await proyect.destroy();
    res.status(200).json({ message: "Registro eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el registro" + error });
  }
};

exports.activeInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const proyect = await Inventory.findByPk(id);
    if (!proyect) {
      res.status(404).json({ error: "No se encontro el registro" });
    }
    proyect.update({ estado: true });
    res.status(200).json({ message: "Registro activado" });
  } catch (error) {
    res.status(500).json({ error: "Error al activar el registro" + error });
  }
};

exports.inactiveInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const proyect = await Inventory.findByPk(id);
    if (!proyect) {
      res.status(404).json({ error: "No se encontro el registro" });
    }
    proyect.update({ estado: false });
    res.status(200).json({ message: "Registro desactivado" });
  } catch (error) {
    res.status(500).json({ error: "Error al desactivar el registro" + error });
  }
};
