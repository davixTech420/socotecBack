const AssignmentPPE = require("../models/assignmentsPPE");
const User = require("../models/user");
const Inventory = require("../models/inventory");

  exports.getAssignment = async (req,res) => {
    try {
      const assignments = await AssignmentPPE.findAll();
      res.status(200).json(assignments);

      
    } catch (error) {
      res.status(500).json({message:"Ha Ocurrido Un Error"});
    }
  }

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
      fechaConfirmacion:fechaConfirmacion === "" ? null : fechaConfirmacion,
      fechaRetorno: fechaRetorno === "" ? null : fechaRetorno,
      fotoppe:fotoppe === "" ? null :fotoppe,
      estado:"Asignado"
    });
    res.status(201).json({ message: "Se Creo Con Exito PPE", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Crear PPE",body:req.body,error });
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
