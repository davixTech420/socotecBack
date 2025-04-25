const AssignmentPPE = require("../models/assignmentsPPE");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/ppe"); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  },
});

// Configuración de multer para múltiples imágenes
const upload = multer({ storage: storage });

exports.getAssignment = async (req, res) => {
  try {
    const assignments = await AssignmentPPE.findAll();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Ha Ocurrido Un Error", error });
  }
};

exports.getMyAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await AssignmentPPE.findAll({ where: { userId: id } });
    res.status(200).json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Erro Al Obtener PPE", error });
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
      fechaConfirmacion: fechaConfirmacion === "" ? null : fechaConfirmacion,
      fechaRetorno: fechaRetorno === "" ? null : fechaRetorno,
      fotoppe: fotoppe === "" ? null : fotoppe,
      estado: "Asignado",
    });
    res.status(201).json({ message: "Se Creo Con Exito PPE", assignment });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ha Ocurrido Un Error Al Crear PPE",
        body: req.body,
        error,
      });
  }
};

 /*  exports.updateAssignment = [
    upload.single("fotoppe"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const {
          inventoryId,
          userId,
          asignadorId,
          fechaConfirmacion,
          fechaRetorno,
          fotoppe,
          fotoRetorno,
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
            fotoRetorno,
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
    },
  ]; */


  exports.updateAssignment = [
    upload.single("fotoppe"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const {
          inventoryId,
          userId,
          asignadorId,
          fechaConfirmacion,
          fechaRetorno,
          fotoRetorno,
          estado,
        } = req.body;
  
        // Si se subió una imagen
        let fotoppe = req.body.fotoppe || null;
        if (req.file) {
          fotoppe = {
            uri: `/ppe/${req.file.filename}`,
            originalName: req.file.originalname,
          };
        }
  
        const assignment = await AssignmentPPE.update(
          {
            inventoryId,
            userId,
            asignadorId,
            fechaConfirmacion,
            fechaRetorno,
            fotoppe,
            fotoRetorno,
            estado,
          },
          { where: { id } }
        );
  
        res.status(200).json({
          message: "Se ha actualizado con éxito PPE",
          assignment,
        });
      } catch (error) {
        res.status(500).json({
          message: "Ha ocurrido un error al actualizar PPE",
          error,
        });
      }
    },
  ];

/* exports.updateAssignment = async (req, res) => {
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
}; */

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
