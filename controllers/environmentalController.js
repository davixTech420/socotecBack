const Environmental = require("../models/environmental");
const condicionsEnvironmental = require("../models/condicionsEnvironmental");
const path = require("path");
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

exports.deleteEnvironmental = async (req, res) => {
  try {
    const { id } = req.params;
    const buscar = await Environmental.findOne({ where: { id: id } });
    if (!buscar) {
      res.status(404).json({ message: "No se encontro el environmental" });
    }

    const condicions = await condicionsEnvironmental.findAll({
      where: { idEnvironmental: id },
    });

    !condicions
      ? res.status(404).json({ message: "No se encontraron registros" })
      : await condicionsEnvironmental.destroy({
          where: { idEnvironmental: id },
        });

    const environ = await Environmental.destroy({ where: { id: id } });

    environ
      ? res.status(200).json({ message: "Se ha eliminidado con exito" })
      : res.status(500);
  } catch (error) {
    res.status(500).json({ error, message: "Ha ocurrido un error" });
  }
};

exports.updateEnvironmental = async (req, res) => {
  try {
    const { id } = req.params;
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

    const environ = await Environmental.findOne({ where: { id: id } });

    !environ
      ? res.status(404).json({ message: "Condicion ambiental no encontrada" })
      : null;

    const update = await Environmental.update(
      {
        nombre,
        codigo,
        norma,
        especificacion,
        rangoMedicion,
        lugarMedicion,
        conclusion,
      },
      { where: { id: id } }
    );

    !update
      ? res.status(500).json({ message: "Ha ocurrido un error al modificar" })
      : null;

    let registrosActualizadas = [];
    if (muestras) {
      const muestrasArray = JSON.parse(muestras);
      // Validar que no haya más de 3 muestras con la misma fechaEjecucion
      const conteoPorFecha = {};

      for (const muestra of muestrasArray) {
        const fecha = muestra.fechaEjecucion;

        conteoPorFecha[fecha] = (conteoPorFecha[fecha] || 0) + 1;

        if (conteoPorFecha[fecha] > 3) {
          return res
            .status(500)
            .json({
              message: `Solo se permiten hasta 3 registros con la fecha ${fecha}`,
            });
        }
      }
      await condicionsEnvironmental.destroy({ where: { idEnvironmental: id } });
      muestrasCreadas = await Promise.all(
        muestrasArray.map(async (muestra) => {
          return await condicionsEnvironmental.create({
            fechaEjecucion: muestra.fechaEjecucion,
            hora: muestra.hora,
            temperatura: muestra.temperatura,
            humedad: muestra.humedad,
            firma: muestra.firma,
            observaciones: muestra.observaciones,
            idEnvironmental: id,
          });
        })
      );
    }

    const updateEnviron = await Environmental.findOne({ where: { id } });
    res.status(200).json({
      message: "Condicion ambiental actualizada correctamente",
      environmental: updateEnviron,
    });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error" });
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
      "../public/templates/PlantillaAmbiental.xlsx"
    );
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(plantillaPath);
    const worksheet = workbook.getWorksheet("Condiciones ambientales (2)");

    // Rellenar datos existentes (como en tu código original)
    worksheet.getCell("D4").value = sampleData.nombre; // Informe No.
    worksheet.getCell("K4").value = sampleData.codigo; // Albarán No.

    worksheet.getCell("D6").value = sampleData.norma; // Cliente
    worksheet.getCell("K6").value = sampleData.especificacion; // Fecha inicio
    worksheet.getCell("D8").value = sampleData.rangoMedicion; // Fecha final
    worksheet.getCell("K8").value = sampleData.lugarMedicion; // Fecha emisión

    // Sección de observaciones
    if (sampleData.conclusion) {
      const observacionesCell = worksheet.getCell("A28");
      observacionesCell.value = sampleData.conclusion;

      // Ajustar el alto de la fila si las observaciones son largas
      const lineas = sampleData.conclusion.split("\n").length;
      worksheet.getRow(42).height = Math.max(15, lineas * 15);
    }
    // Insertar datos de sampleApique en B12:M26
    if (sampleApique.length > 0) {
      const startRow = 12; // Fila inicial (b28)
      const endRow = 26; // Fila final (M26)
      const startCol = 2; // Columna B (2)
      const endCol = 13; // Columna M (13)

      sampleApique.forEach((muestra, index) => {
        const currentRow = startRow + index;

        // Datos básicos (ajusta según tus necesidades)
        worksheet.getCell(`B${currentRow}`).value = muestra.fechaEjecucion;
        worksheet.getCell(`E${currentRow}`).value = muestra.hora;
        worksheet.getCell(`F${currentRow}`).value = muestra.temperatura;
        worksheet.getCell(`H${currentRow}`).value = muestra.humedad;
        worksheet.getCell(`J${currentRow}`).value = muestra.firma;
        worksheet.getCell(`L${currentRow}`).value = muestra.observaciones;
      });
    }

    // Configurar respuesta
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Ambiental_${sampleData.id}.xlsx"`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error al generar Excel:", error);
    res.status(500).json({ error: "Error al generar el Excel" });
  }
};
