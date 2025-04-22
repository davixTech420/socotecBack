const AssignmentPPE = require("../models/assignmentsPPE");
const User = require("../models/user");
const Inventory = require("../models/inventory");
/* exports.getAssignment = async (req,res) => {
  try {
    const Assignment = await AssignmentPPE.findAll();
    res.status(200).json(Assignment);
  } catch (error) {
    res.status(500).json({ message: "Ha Ocurrido Un Error Al Obtener PPE" });
  }
}; */
exports.getAssignment = async (req, res) => {
    try {
      const assignments = await AssignmentPPE.findAll();
  
      const results = await Promise.all(
        assignments.map(async (a) => {
          // Buscar nombres manualmente
          const usuario = await User.findByPk(a.userId);
          const asignador = await User.findByPk(a.asignadorId);
          const material = await Inventory.findByPk(a.inventoryId);
  
          return {
            id: a.id,
            inventoryId: material?.nombreMaterial,
            userId: usuario?.nombre,
            asignadorId: asignador?.nombre,
            estado: a.estado,
            fechaConfirmacion: a.fechaConfirmacion,
            fechaRetorno: a.fechaRetorno,
            fotoppe: a.fotoppe,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt
          };
        })
      );
  
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Ha Ocurrido Un Error Al Obtener PPE" });
    }
  };

exports.createAssignment = async (req, res) => {
  try {
    const {
      inventoryId,
      userId,
      asignadorId,
      fechaConfirmacion,
      fechaRetorno,
      fotoppe,
      estado,
    } = req.body;

    const assignment = await AssignmentPPE.create({
      inventoryId,
      userId,
      asignadorId,
      fechaConfirmacion,
      fechaRetorno,
      fotoppe,
      estado,
    });
    res.status(201).json({ message: "Se Creo Con Exito PPE", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Crear PPE", error });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      inventoryId,
      userId,
      asignadorId,
      fechaConfirmacion,
      fechaRetorno,
      fotoppe,
      estado,
    } = req.body;

    const assignment = await AssignmentPPE.update(
      {
        inventoryId,
        userId,
        asignadorId,
        fechaConfirmacion,
        fechaRetorno,
        fotoppe,
        estado,
      },
      { where: { id } }
    );
    res
      .status(200)
      .json({ message: "Se Ha Actulizado Con Exito PPE", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Actulizar PPE", error });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await AssignmentPPE.destroy({ where: { id } });
    res.status(200).json({ message: "Se Ha Eliminado Con Exito PPE" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Eliminar PPE", error });
  }
};
