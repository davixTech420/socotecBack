const AssignmentPPE = require("../models/assignmentsPPE");
const Inventory = require("../models/inventory");
const fs = require("fs");
const sequelize = require("sequelize");
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
      fotoRetorno,
    } = req.body;

    const assignment = await AssignmentPPE.create({
      inventoryId,
      userId,
      asignadorId,
      fechaConfirmacion: fechaConfirmacion === "" ? null : fechaConfirmacion,
      fechaRetorno: fechaRetorno === "" ? null : fechaRetorno,
      fotoppe: fotoppe === "" ? null : fotoppe,
      fotoRetorno: fotoRetorno === "" ? null : fotoRetorno,
      estado: "Asignado",
    });
    res.status(201).json({ message: "Se Creo Con Exito PPE", assignment });
  } catch (error) {
    res.status(500).json({
      message: "Ha Ocurrido Un Error Al Crear PPE",
      body: req.body,
      error,
    });
  }
};

/* 
exports.updateAssignment = [
  upload.fields([
    { name: "fotoppe", maxCount: 1 },
    { name: "fotoRetorno", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Procesar archivos subidos
      const fotoppeFile = req.files?.fotoppe?.[0];
      const fotoRetornoFile = req.files?.fotoRetorno?.[0];

      // Determinar si se están subiendo nuevas fotos
      const isNewFotoPpe = !!fotoppeFile;
      const isNewFotoRetorno = !!fotoRetornoFile;
      
      // Obtener solo la fecha (sin hora) en formato YYYY-MM-DD
      const getCurrentDateOnly = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
      };

      // Rutas de imágenes
      const fotoppePath = fotoppeFile
        ? `/ppe/${fotoppeFile.filename}`
        : req.body.fotoppe;

      const fotoRetornoPath = fotoRetornoFile
        ? `/ppe/${fotoRetornoFile.filename}`
        : req.body.fotoRetorno;

      // Preparar datos para actualización
      const updateData = {
        inventoryId: req.body.inventoryId,
        userId: req.body.userId,
        asignadorId: req.body.asignadorId,
        fotoppe: fotoppePath,
        fotoRetorno: fotoRetornoPath
      };

      // Manejo de fotoppe (confirmación)
      if (isNewFotoPpe) {
        updateData.fechaConfirmacion = getCurrentDateOnly();
        updateData.estado = "confirmado";
      } else if (req.body.fechaConfirmacion) {
        updateData.fechaConfirmacion = req.body.fechaConfirmacion;
      } else {
        updateData.fechaConfirmacion = null;
      }

      // Manejo de fotoRetorno (devolución)
      if (isNewFotoRetorno) {
        updateData.fechaRetorno = getCurrentDateOnly();
        updateData.estado = "devuelto";
      } else if (req.body.fechaRetorno) {
        updateData.fechaRetorno = req.body.fechaRetorno;
      } else {
        updateData.fechaRetorno = null;
      }

      // Si no hay cambios en fotos, mantener el estado existente
      if (!isNewFotoPpe && !isNewFotoRetorno && req.body.estado) {
        updateData.estado = req.body.estado;
      }

      // Actualizar base de datos
      const [updated] = await AssignmentPPE.update(
        updateData,
        { where: { id } }
      );

      if (updated === 0) {
        return res.status(404).json({ message: "Registro no encontrado" });
      }

      res.status(200).json({
        message: "Actualización exitosa",
        assignment: await AssignmentPPE.findByPk(id),
      });
    } catch (error) {
      res.status(500).json({
        message: "Error en el servidor",
        error: error.message,
      });
    }
  },
]; */

exports.updateAssignment = [
  upload.fields([
    { name: "fotoppe", maxCount: 1 },
    { name: "fotoRetorno", maxCount: 1 },
  ]),
  async (req, res) => {
    let transaction;
    try {
      transaction = await AssignmentPPE.sequelize.transaction();

      const { id } = req.params;
      const fotoppeFile = req.files?.fotoppe?.[0];
      const fotoRetornoFile = req.files?.fotoRetorno?.[0];

      const isNewFotoPpe = !!fotoppeFile;
      const isNewFotoRetorno = !!fotoRetornoFile;

      const getCurrentDateOnly = () => new Date().toISOString().split("T")[0];

      const fotoppePath = fotoppeFile
        ? `/ppe/${fotoppeFile.filename}`
        : req.body.fotoppe;
      const fotoRetornoPath = fotoRetornoFile
        ? `/ppe/${fotoRetornoFile.filename}`
        : req.body.fotoRetorno;

      const currentAssignment = await AssignmentPPE.findByPk(id, {
        transaction,
      });

      const updateData = {
        inventoryId: req.body.inventoryId,
        userId: req.body.userId,
        asignadorId: req.body.asignadorId,
        fotoppe: fotoppePath,
        fotoRetorno: fotoRetornoPath,
      };

      if (isNewFotoPpe) {
        updateData.fechaConfirmacion = getCurrentDateOnly();
        updateData.estado = "confirmado";
      } else {
        updateData.fechaConfirmacion = req.body.fechaConfirmacion || null;
      }

      if (isNewFotoRetorno) {
        updateData.fechaRetorno = getCurrentDateOnly();
        updateData.estado = "devuelto";
      } else {
        updateData.fechaRetorno = req.body.fechaRetorno || null;
      }

      if (!isNewFotoPpe && !isNewFotoRetorno && req.body.estado) {
        updateData.estado = req.body.estado;
      }

      const [updated] = await AssignmentPPE.update(updateData, {
        where: { id },
        transaction,
      });

      if (updated === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: "Registro no encontrado" });
      }

      // Actualización de inventario
      if ((isNewFotoPpe || isNewFotoRetorno) && req.body.inventoryId) {
        const inventoryUpdate = {};

        if (
          isNewFotoPpe &&
          (!currentAssignment || currentAssignment.estado !== "confirmado")
        ) {
          inventoryUpdate.cantidad = sequelize.literal("cantidad - 1");
        }

        if (
          isNewFotoRetorno &&
          (!currentAssignment || currentAssignment.estado !== "devuelto")
        ) {
          inventoryUpdate.cantidad = sequelize.literal("cantidad + 1");
        }

        if (Object.keys(inventoryUpdate).length > 0) {
          await Inventory.update(inventoryUpdate, {
            where: { id: req.body.inventoryId },
            transaction,
          });
        }
      }

      await transaction.commit();
      const updatedAssignment = await AssignmentPPE.findByPk(id);

      res.status(200).json({
        message: "Actualización exitosa",
        assignment: updatedAssignment,
      });
    } catch (error) {
      if (transaction) await transaction.rollback();
      
      res.status(500).json({
        message: "Error en el servidor",
        error: error.message,
      });
    }
  },
];


/* exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await AssignmentPPE.destroy({ where: { id } });
    res.status(200).json({ message: "Se Ha Eliminado Con Exito PPE" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Eliminar PPE", error });
  }
}; */


exports.deleteAssignment = async (req, res) => {
  const transaction = await AssignmentPPE.sequelize.transaction();
  try {
    const { id } = req.params;
    
    // 1. Primero obtener el registro para conocer las rutas de los archivos
    const assignment = await AssignmentPPE.findOne({ 
      where: { id },
      transaction
    });

    if (!assignment) {
      await transaction.rollback();
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    // 2. Eliminar los archivos físicos si existen
    const deleteFile = (filePath) => {
      if (!filePath) return;
      
      const fullPath = path.join(__dirname, '../public', filePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`Archivo eliminado: ${fullPath}`);
      }
    };

    // Eliminar ambas fotos si existen
    deleteFile(assignment.fotoppe);
    deleteFile(assignment.fotoRetorno);

    // 3. Actualizar el inventario si es necesario (sumar 1 si estaba confirmado)
    if (assignment.estado === 'confirmado' && assignment.inventoryId) {
      await Inventory.increment('cantidad', {
        where: { id: assignment.inventoryId },
        by: 1,
        transaction
      });
    }

    // 4. Finalmente eliminar el registro de la base de datos
    await AssignmentPPE.destroy({ 
      where: { id },
      transaction
    });

    await transaction.commit();
    res.status(200).json({ message: "Se ha eliminado con éxito el PPE y sus archivos asociados" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al eliminar assignment:", error);
    res.status(500).json({ 
      message: "Ha ocurrido un error al eliminar el PPE",
      error: error.message 
    });
  }
};