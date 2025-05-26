const Apique = require("../models/apique");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ExcelJS = require("exceljs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/apique"); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  },
});

// Configuración de multer para múltiples imágenes
const upload = multer({ storage: storage });
exports.getApiques = async (req, res) => {
  try {
    const apiques = await Apique.findAll();
    res.status(200).json(apiques);
  } catch (error) {
    res.status(500).json({ message: "Ha Ocurrido Un Error", error });
  }
};

exports.createApique = [
  upload.array("imagenes", 5), // Permite subir hasta 5 imágenes
  async (req, res) => {
    try {
      const {
        informeNum,
        cliente,
        tituloObra,
        localizacion,
        albaranNum,
        fechaEjecucionInicio,
        fechaEjecucionFinal,
        fechaEmision,
        tipo,
        operario,
        largoApique,
        anchoApique,
        profundidadApique,
        observaciones,
      } = req.body;

      // Verifica si hay archivos subidos
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No se subieron imágenes" });
      }

      const imagenes = req.files.map((file) => {
        return {
          uri: `/apique/${file.filename}`, // Ruta pública de la imagen
          originalName: file.originalname,
        };
      });

      // Crea el proyecto en la base de datos
      const apiques = await Apique.create({
        informeNum,
        cliente,
        tituloObra,
        localizacion,
        albaranNum,
        fechaEjecucionInicio,
        fechaEjecucionFinal,
        fechaEmision,
        tipo,
        operario,
        largoApique,
        anchoApique,
        profundidadApique,
        imagenes,
        observaciones,
      });
      res.status(200).json({ apiques });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al crear el proyecto", error });
    }
  },
];

exports.updateApique = [
  upload.array("imagenes", 5),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        informeNum,
        cliente,
        tituloObra,
        localizacion,
        albaranNum,
        fechaEjecucionInicio,
        fechaEjecucionFinal,
        fechaEmision,
        tipo,
        operario,
        largoApique,
        anchoApique,
        profundidadApique,
        observaciones,
        imagenes: existingImages = [], // Cambiado de existingImages a imagenes para consistencia
      } = req.body;

      // Asegurar que existingImages sea un array
      const parsedExistingImages = Array.isArray(existingImages)
        ? existingImages
        : existingImages
        ? [existingImages]
        : [];

      // Buscar el proyecto existente
      const proyecto = await Apique.findOne({ where: { id } });
      if (!proyecto) {
        return res.status(404).json({ error: "Apique no encontrado" });
      }

      // Obtener imágenes actuales del proyecto
      const currentImages = proyecto.imagenes || [];

      // 1. Manejo de imágenes a eliminar
      const imagesToKeep = parsedExistingImages.filter(
        (img) => img && typeof img === "string"
      );
      const imagesToDelete = currentImages
        .filter((img) => !imagesToKeep.includes(img.uri))
        .map((img) => img.uri);

      // Eliminar archivos físicos de las imágenes removidas
      imagesToDelete.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", "public", imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath); // Usamos sync para asegurar la eliminación antes de continuar
          console.log(`Imagen eliminada: ${imgPath}`);
        }
      });

      // 2. Manejo de nuevas imágenes subidas
      const newImages = req.files
        ? req.files.map((file) => ({
            uri: `/apique/${file.filename}`,
            originalName: file.originalname,
          }))
        : [];

      // 3. Combinar imágenes existentes (que se mantienen) con nuevas
      const finalImages = [
        ...currentImages.filter((img) => imagesToKeep.includes(img.uri)),
        ...newImages,
      ];

      // Actualizar el proyecto en la base de datos
      const [updated] = await Apique.update(
        {
          informeNum,
          cliente,
          tituloObra,
          localizacion,
          albaranNum,
          fechaEjecucionInicio,
          fechaEjecucionFinal,
          fechaEmision,
          tipo,
          operario,
          largoApique,
          anchoApique,
          profundidadApique,
          imagenes: finalImages,
          observaciones,
        },
        { where: { id } }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ error: "No se pudo actualizar el apique" });
      }

      // Obtener el proyecto actualizado para devolverlo
      const updatedApique = await Apique.findOne({ where: { id } });
      res.status(200).json({
        message: "Apique actualizado correctamente",
        apique: updatedApique,
      });
    } catch (error) {
      console.error("Error al actualizar apique:", error);
      res.status(500).json({
        error: "Error al actualizar el proyecto",
        details: error.message,
      });
    }
  },
];

exports.deleteApique = async (req, res) => {
  try {
    const id = req.params.id;

    const portafolio = await Apique.findOne({ where: { id } });
    if (!portafolio) {
      return res.status(404).json({ error: "No se encontró el registro" });
    }
    if (portafolio.estado) {
      return res.status(400).json({
        message: "No se puede eliminar un proyecto del portafolio activo",
      });
    }
    const images = portafolio.imagenes;
    const uploadDir = path.join(__dirname, "../public");
    images.forEach((image) => {
      // Construir la ruta completa de la imagen
      const imagePath = path.join(uploadDir, image.uri); // Usar la propiedad "uri" para la ruta de la imagen
      try {
        if (fs.existsSync(imagePath)) {
          // Verificar si la imagen existe
          fs.unlinkSync(imagePath); // Eliminar la imagen
          console.log(`Imagen eliminada: ${imagePath}`);
        } else {
          console.warn(`La imagen no existe: ${imagePath}`);
        }
      } catch (err) {
        console.error(`Error al eliminar la imagen ${image.uri}:`, err);
      }
    });
    const proyect = await Apique.destroy({ where: { id } });
    res.status(200).json(proyect);
  } catch (error) {
    console.error("Error al eliminar el proyecto del portafolio:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar el proyecto del portafolio" });
  }
};

const sampleData = {
  albaranNum: "34",
  anchoApique: "12.3",
  cliente: "asdsadsada",
  createdAt: "2025-05-16T19:32:40.399Z",
  estado: true,
  fechaEjecucionFinal: "2025-06-05",
  fechaEjecucionInicio: "2025-06-05",
  fechaEmision: "2025-06-05",
  id: 5,
  imagenes: [{ uri: "image1.jpg" }, { uri: "image2.jpg" }],
  informeNum: "23",
  largoApique: "12.3",
  localizacion: "asdasd",
  observaciones: "dsadsadsa",
  operario: "sadasdasd",
  profundidadApique: "45.2",
  tipo: "asdsadasd",
  tituloObra: "asdasd",
  updatedAt: "2025-05-16T19:32:40.399Z",
};

exports.generateExcel = async (req, res) => {
  try {
const {id} = req.params;
const sampleData = await Apique.findOne({where:{id:id}})


    // 1. Cargar la plantilla (ajusta la ruta según donde esté tu plantilla)
    const plantillaPath = path.join(
      __dirname,
      "../public/templates/PlantillaApique.xlsx"
    );
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(plantillaPath);

    // 2. Obtener la hoja 'Perfil'
    const worksheet = workbook.getWorksheet("Perfil");

    // 3. Rellenar los datos en las celdas correspondientes
    // Sección superior
    worksheet.getCell("D4").value = sampleData.informeNum; // Informe No.
    worksheet.getCell("L4").value = sampleData.albaranNum; // Albarán No.

    worksheet.getCell("D5").value = sampleData.cliente; // Cliente
    worksheet.getCell("L5").value = sampleData.fechaEjecucionInicio; // Fecha inicio
    worksheet.getCell("L6").value = sampleData.fechaEjecucionFinal; // Fecha final
    worksheet.getCell("L7").value = sampleData.fechaEmision; // Fecha emisión

    worksheet.getCell("D6").value = sampleData.tituloObra; // Título de obra
    worksheet.getCell("D7").value = sampleData.localizacion; // Localización

    // Sección nivel freático y dimensiones
    worksheet.getCell("M10").value = sampleData.id; // Apique No.
    worksheet.getCell("M11").value = sampleData.tipo; // Tipo
    worksheet.getCell("M12").value = sampleData.operario; // Operario

    worksheet.getCell("H10").value = sampleData.largoApique; // Largo (m)
    worksheet.getCell("H11").value = sampleData.anchoApique; // Ancho (m)
    worksheet.getCell("H12").value = sampleData.profundidadApique; // Profundidad (m)
    // Sección de observaciones
    if (sampleData.observaciones) {
      const observacionesCell = worksheet.getCell("A47");
      observacionesCell.value = sampleData.observaciones;

      // Ajustar el alto de la fila si las observaciones son largas
      const lineas = sampleData.observaciones.split("\n").length;
      worksheet.getRow(42).height = Math.max(15, lineas * 15);
    }
    // Configurar cabeceras para descarga
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Apique_${sampleData.id}.xlsx"`
    );

    // Escribir el workbook directamente en la respuesta
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json(error);
  }
};
