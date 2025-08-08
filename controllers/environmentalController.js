const Environmental = require("../models/environmental");
const condicionsEnvironmental = require("../models/condicionsEnvironmental");
const path = require("path");
const ExcelJS = require("exceljs");
const moment = require('moment-timezone');
const { Op } = require("sequelize");

// Función para obtener la hora actual en Colombia
const getColombiaTime = () => {
  return moment().tz('America/Bogota').format('HH:mm:ss');
};

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

    // 1️⃣ Buscar environmental
    const environ = await Environmental.findByPk(id);
    if (!environ) {
      return res.status(404).json({ message: "Condición ambiental no encontrada" });
    }

    // 2️⃣ Actualizar datos principales
    await environ.update({
      nombre,
      codigo,
      norma,
      especificacion,
      rangoMedicion,
      lugarMedicion,
      conclusion,
    });

    // 3️⃣ Procesar muestras
    if (muestras) {
      const muestrasArray = JSON.parse(muestras);

      // 3.1 Obtener las que ya están en BD
      const registrosEnBD = await condicionsEnvironmental.findAll({
        where: { idEnvironmental: id }
      });
      const idsEnBD = registrosEnBD.map(r => r.id);

      // 3.2 Detectar nuevas (no tienen id o no existen en BD)
      const nuevasMuestras = muestrasArray.filter(m =>
        !m.id || !idsEnBD.includes(m.id)
      ).map(m => ({
        ...m,
        fechaEjecucion: moment.tz("America/Bogota").format("YYYY-MM-DD"),
        hora: moment.tz("America/Bogota").format("HH:mm:ss"),
        idEnvironmental: id
      }));

      // 3.3 Validar máximo 3 registros por fecha para nuevas
      for (const muestra of nuevasMuestras) {
        const fechaAValidar = muestra.fechaEjecucion;

        const registrosExistentes = await condicionsEnvironmental.count({
          where: { idEnvironmental: id, fechaEjecucion: fechaAValidar }
        });

        const nuevosEnEstaFecha = nuevasMuestras.filter(
          m => m.fechaEjecucion === fechaAValidar
        ).length;

        if (registrosExistentes + nuevosEnEstaFecha > 3) {
          return res.status(400).json({
            message: `Solo se permiten hasta 3 registros para la fecha ${fechaAValidar}`,
          });
        }
      }

      // 3.4 Insertar nuevas
      if (nuevasMuestras.length > 0) {
        await condicionsEnvironmental.bulkCreate(nuevasMuestras);
      }

      // 3.5 Eliminar las que ya no están en el front
      const idsEnviados = muestrasArray.filter(m => m.id).map(m => m.id);
      const idsAEliminar = idsEnBD.filter(idExistente => !idsEnviados.includes(idExistente));

      if (idsAEliminar.length > 0) {
        await condicionsEnvironmental.destroy({
          where: { id: idsAEliminar }
        });
      }
    }

    // 4️⃣ Respuesta final
    const updateEnviron = await Environmental.findByPk(id);
    const condiciones = await condicionsEnvironmental.findAll({ where: { idEnvironmental: id } });

    res.status(200).json({
      message: "Condición ambiental actualizada correctamente",
      environmental: updateEnviron,
      condiciones
    });

  } catch (error) {
    console.error("Error en updateEnvironmental:", error);
    res.status(500).json({ message: "Ha ocurrido un error" });
  }
};


exports.generateExcel = async (req, res) => {
  try {
    const { id } = req.params;
    const sampleData = await Environmental.findOne({ where: { id: id } });
    let sampleApique = await condicionsEnvironmental.findAll({
      where: { idEnvironmental: id },
      order: [["fechaEjecucion", "ASC"], ["hora", "ASC"]],
    });

    // Agrupar por fechaEjecucion
    const gruposPorFecha = {};
    sampleApique.forEach((muestra) => {
      const fecha = muestra.fechaEjecucion;
      if (!gruposPorFecha[fecha]) {
        gruposPorFecha[fecha] = [];
      }
      gruposPorFecha[fecha].push(muestra);
    });

    // Normalizar: cada fecha debe tener 3 registros (rellenar con vacíos si faltan)
    const datosFinales = [];
    Object.keys(gruposPorFecha).forEach((fecha) => {
      const registros = gruposPorFecha[fecha];
      // Agregar registros existentes
      registros.forEach((m) => datosFinales.push(m));
      // Si hay menos de 3, rellenar vacíos
      for (let i = registros.length; i < 3; i++) {
        datosFinales.push({
          fechaEjecucion: fecha,
          hora: "",
          temperatura: "",
          humedad: "",
          firma: "",
          observaciones: "",
        });
      }
    });

    // Cargar plantilla
    const plantillaPath = path.join(
      __dirname,
      "../public/templates/PlantillaAmbiental.xlsx"
    );
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(plantillaPath);
    const worksheet = workbook.getWorksheet("Condiciones ambientales (2)");

    // Rellenar datos del encabezado
    worksheet.getCell("D4").value = sampleData.nombre;
    worksheet.getCell("K4").value = sampleData.codigo;
    worksheet.getCell("D6").value = sampleData.norma;
    worksheet.getCell("K6").value = sampleData.especificacion;
    worksheet.getCell("D8").value = sampleData.rangoMedicion;
    worksheet.getCell("K8").value = sampleData.lugarMedicion;

    if (sampleData.conclusion) {
      worksheet.getCell("A28").value = sampleData.conclusion;
      const lineas = sampleData.conclusion.split("\n").length;
      worksheet.getRow(42).height = Math.max(15, lineas * 15);
    }

    // Insertar datos en B12:M26
    const startRow = 12;
    datosFinales.forEach((muestra, index) => {
      const currentRow = startRow + index;
      worksheet.getCell(`B${currentRow}`).value = muestra.fechaEjecucion;
      worksheet.getCell(`E${currentRow}`).value = muestra.hora;
      worksheet.getCell(`F${currentRow}`).value = muestra.temperatura;
      worksheet.getCell(`H${currentRow}`).value = muestra.humedad;
      worksheet.getCell(`J${currentRow}`).value = muestra.firma;
      worksheet.getCell(`L${currentRow}`).value = muestra.observaciones;
    });

    // Enviar archivo al cliente
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
