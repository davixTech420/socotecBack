const Apique = require("../models/apique");
const SampleApique = require("../models/sampleApique");
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
  upload.array("imagenes", 5),
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
        muestras, // Este es el array de muestras en formato string JSON
      } = req.body;

      // Verifica si hay archivos subidos
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No se subieron imágenes" });
      }

      const imagenes = req.files.map((file) => {
        return {
          uri: `/apique/${file.filename}`,
          originalName: file.originalname,
        };
      });

      // 1. Crear el apique principal
      const apique = await Apique.create({
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

      // 2. Procesar las muestras (si existen)
      let muestrasCreadas = [];
      if (muestras) {
        // Parsear el string JSON a array
        const muestrasArray = JSON.parse(muestras);

        // Crear cada muestra asociada al apique
        muestrasCreadas = await Promise.all(
          muestrasArray.map(async (muestra) => {
            return await SampleApique.create({
              sampleNum: muestra.sampleNum,
              profundidadInicio: muestra.profundidadInicio,
              profundidadFin: muestra.profundidadFin,
              espresor: muestra.espresor,
              estrato: muestra.estrato,
              descripcion: muestra.descripcion,
              resultados:muestra.resultados,
              granulometria:muestra.granulometria,
              uscs:muestra.uscs,
              tipoMuestra: muestra.tipoMuestra,
              pdcLi: muestra.pdcLi,
              pdcLf: muestra.pdcLf,
              pdcGi: muestra.pdcGi,
              apiqueId: apique.id,
            });
          })
        );
      }

      res.status(200).json({
        apique,
        muestras: muestrasCreadas,
        message: "Apique y muestras creadas exitosamente",
      });
    } catch (error) {
      console.error("Error al crear el apique:", error);
      res.status(500).json({
        message: "Error al crear el proyecto",
        error: error.message,
      });
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
        muestras,
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

// Actualizar muestras
let muestrasActualizadas = [];
if (muestras) {
  const muestrasArray = JSON.parse(muestras);

  // Puedes eliminar todas las muestras anteriores y recrearlas (si prefieres)
  await SampleApique.destroy({ where: { apiqueId:id } });

  muestrasActualizadas = await Promise.all(
    muestrasArray.map(async (muestra) => {
      return await SampleApique.create({
        sampleNum: muestra.sampleNum,
        profundidadInicio: muestra.profundidadInicio,
        profundidadFin: muestra.profundidadFin,
        espresor: muestra.espresor, // sigue igual si se usa este campo
        estrato: muestra.estrato,
        descripcion: muestra.descripcion,
        resultados:muestra.resultados,
        granulometria:muestra.granulometria,
        uscs:muestra.uscs,
        tipoMuestra: muestra.tipoMuestra,
        pdcLi: muestra.pdcLi,
        pdcLf: muestra.pdcLf,
        pdcGi: muestra.pdcGi,
        apiqueId: id,
      });
    })
  );
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


    const muestras = await SampleApique.destroy({where:{apiqueId:id}});
    const proyect = await Apique.destroy({ where: { id } });
    res.status(200).json(proyect);
  } catch (error) {
    console.error("Error al eliminar el proyecto del portafolio:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar el proyecto del portafolio" });
  }
};

exports.generateExcel = async (req, res) => {
  try {
    const { id } = req.params;
    const sampleData = await Apique.findOne({ where: { id: id } });
    const sampleApique = await SampleApique.findAll({
      where: { apiqueId: id },
    });

    // Cargar plantilla
    const plantillaPath = path.join(
      __dirname,
      "../public/templates/PlantillaApique.xlsx"
    );
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(plantillaPath);
    const worksheet = workbook.getWorksheet("Perfil");

    // Rellenar datos existentes (como en tu código original)
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
    // Insertar datos de sampleApique en A16:N24
    if (sampleApique.length > 0) {
      const startRow = 16; // Fila inicial (A16)
      const endRow = 24; // Fila final (N24)
      const startCol = 1; // Columna A (1)
      const endCol = 14; // Columna N (14)

      // Calcular espacio disponible
      const availableRows = endRow - startRow + 1;
      const rowsPerSample = Math.floor(availableRows / sampleApique.length);

      sampleApique.forEach((muestra, index) => {
        const currentRow = startRow + index * rowsPerSample;
        
        const row = worksheet.getRow(currentRow);
        row.eachCell((cell) => {
          cell.style = {}; // Reset completo de estilos
          cell.fill = undefined;
          cell.border = undefined;
          cell.font = undefined;
        });

        // Datos básicos (ajusta según tus necesidades)
        worksheet.getCell(`A${currentRow}`).value = index + 1; // Número consecutivo
        worksheet.getCell(`B${currentRow}`).value = muestra.profundidadInicio;
        worksheet.getCell(`C${currentRow}`).value = muestra.profundidadFin;
        worksheet.getCell(`D${currentRow}`).value = muestra.espresor;

 // 2. Aplicar SOLO a la celda E (Estinto)
 const cellE = worksheet.getCell(`E${currentRow}`);
  
 // Reset completo de la celda E
 cellE.style = {};
 cellE.value = ''; // Valor vacío
 
 // Validar y aplicar color HEX
 if (/^#?([0-9A-F]{3,6})$/i.test(muestra.estrato)) {
   const hexColor = muestra.estrato.replace('#', '');
   // Rellenar solo el fondo
   cellE.fill = {
     type: 'pattern',
     pattern: 'solid',
     fgColor: { argb: hexColor.length === 3 ? 
       `${hexColor[0]}${hexColor[0]}${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}` : 
       hexColor.padEnd(6, '0') }
   };
 } else {
   cellE.value = muestra.estrato || '';
 }
        
        worksheet.getCell(`F${currentRow}`).value = muestra.descripcion;
        worksheet.getCell(`H${currentRow}`).value = muestra.resultados;
        worksheet.getCell(`I${currentRow}`).value = muestra.granulometria;
        worksheet.getCell(`J${currentRow}`).value = muestra.uscs;
        worksheet.getCell(`K${currentRow}`).value = muestra.tipoMuestra;
        worksheet.getCell(`L${currentRow}`).value = muestra.pdcLi;
        worksheet.getCell(`M${currentRow}`).value = muestra.pdcLf;
        worksheet.getCell(`N${currentRow}`).value = muestra.pdcGi;

        // Si necesitas combinar celdas para descripción larga
        if (muestra.descripcion && muestra.descripcion.length > 30) {
          worksheet.mergeCells(`G${currentRow}:J${currentRow}`);
          worksheet.getCell(`G${currentRow}`).alignment = { wrapText: true };
          worksheet.getRow(currentRow).height = 40;
        }
      });
    }
    // Insertar imágenes en A16:N24 con márgenes pequeños
    if (sampleData.imagenes && sampleData.imagenes.length > 0) {
      const images = sampleData.imagenes;
      const totalImages = images.length;
      const startRow = 33; // Fila inicial (A16)
      const endRow = 41; // Fila final (N24)
      const startCol = 1; // Columna A (1)
      const endCol = 14; // Columna N (14)

      // Configuración de márgenes (en celdas)
      const paddingHorizontal = 0.5; // Espacio entre imágenes (0.5 = medio ancho de celda)
      const paddingVertical = 1; // Margen arriba/abajo (1 fila)

      // Ancho disponible para imágenes (descontando márgenes horizontales)
      const totalHorizontalPadding = paddingHorizontal * (totalImages - 1);
      const availableWidth = endCol - startCol + 1 - totalHorizontalPadding;
      const imageWidth = availableWidth / totalImages;

      // Alto disponible para imágenes (descontando márgenes verticales)
      const imageHeight = endRow - startRow + 1 - 2 * paddingVertical;

      // Posición vertical (centrada con márgenes)
      const imageTopRow = startRow + paddingVertical;

      // Insertar cada imagen
      for (let i = 0; i < totalImages; i++) {
        const imagePath = path.join(__dirname, "../public", images[i].uri);
        const imageExt = path.extname(images[i].uri).substring(1);

        // Calcular posición horizontal (con márgenes)
        const imageLeftCol = startCol + i * (imageWidth + paddingHorizontal);

        // Añadir imagen al Excel
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: imageExt,
        });

        worksheet.addImage(imageId, {
          tl: { col: imageLeftCol - 1, row: imageTopRow - 1 }, // Top-left (0-based)
          br: {
            col: imageLeftCol + imageWidth - 1,
            row: imageTopRow + imageHeight - 1,
          },
        });
      }
    }

    // Configurar respuesta
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Apique_${sampleData.id}.xlsx"`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al generar Excel:", error);
    res.status(500).json({ error: "Error al generar el Excel" });
  }
};