const Environmental = require("../models/environmental");
const condicionsEnvironmental = require("../models/condicionsEnvironmental");
const ExcelJS = require("exceljs");

exports.createEnvironmental = async (req, res) => {
  try {
    const {
      nombre,
      codigo,
      norma,
      especificacion,
      rangoMedicion,
      lugarMedicion,
      conclusion,
      muestras,
    } = req.body;

    const environmental = await Environmental.create({
      nombre,
      codigo,
      norma,
      especificacion,
      rangoMedicion,
      lugarMedicion,
      conclusion,
    });

    let muestrasCreadas = [];
    if (muestras) {
      const muestrasArray = JSON.parse(muestras);

      muestrasCreadas = await Promise.all(
        muestrasArray.map(async (muestra) => {
          return await condicionsEnvironmental.create({
            fechaEjecucion: muestra.fechaEjecucion,
            hora: muestra.hora,
            temperatura: muestra.temperatura,
            humedad: muestra.temperatura,
            firma: muestra.firma,
            observaciones: muestra.observaciones,
            idEnvironmental: environmental.id,
          });
        })
      );
    }
    res.status(201).json({ environmental, message: "Se ha creado con exito" });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error", error });
  }
};

exports.getEnvironmental = async (req, res) => {
  try {
    const environmental = await Environmental.findAll();
    res.status(200).json(environmental);
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error" });
  }
};

exports.getSampleEnvironmentalById = async (req, res) => {
  try {
    const { environmentalId } = req.params;
    const muestras = await condicionsEnvironmental.findAll({
      where: { idEnvironmental: environmentalId },
    });
    res.status(200).json(muestras);
  } catch (error) {
    res.status(500).json({ error });
  }
};



exports.generateExcel = async (req, res) => {
  try {
    const { id } = req.params;
    const sampleData = await Environmental.findOne({ where: { id: id } });
    const sampleApique = await condicionsEnvironmental.findAll({
      where: { idEnvironmental: id },
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