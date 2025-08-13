const Environmental = require("../models/environmental");
const condicionsEnvironmental = require("../models/condicionsEnvironmental");
const path = require("path");
const ExcelJS = require("exceljs");
const moment = require("moment-timezone");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
require("dayjs/locale/es");
dayjs.locale("es");
const isoWeek = require("dayjs/plugin/isoWeek");
dayjs.extend(isoWeek);

// Función para obtener la hora actual en Colombia
const getColombiaTime = () => {
  return moment().tz("America/Bogota").format("HH:mm:ss");
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
      return res
        .status(404)
        .json({ message: "Condición ambiental no encontrada" });
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
        where: { idEnvironmental: id },
      });
      const idsEnBD = registrosEnBD.map((r) => r.id);

      // 3.2 Detectar nuevas (no tienen id o no existen en BD)
      const nuevasMuestras = muestrasArray
        .filter((m) => !m.id || !idsEnBD.includes(m.id))
        .map((m) => ({
          ...m,
          fechaEjecucion: moment.tz("America/Bogota").format("YYYY-MM-DD"),
          hora: moment.tz("America/Bogota").format("HH:mm:ss"),
          idEnvironmental: id,
        }));

      // 3.3 Validar máximo 3 registros por fecha para nuevas
      for (const muestra of nuevasMuestras) {
        const fechaAValidar = muestra.fechaEjecucion;

        const registrosExistentes = await condicionsEnvironmental.count({
          where: { idEnvironmental: id, fechaEjecucion: fechaAValidar },
        });

        const nuevosEnEstaFecha = nuevasMuestras.filter(
          (m) => m.fechaEjecucion === fechaAValidar
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
      const idsEnviados = muestrasArray.filter((m) => m.id).map((m) => m.id);
      const idsAEliminar = idsEnBD.filter(
        (idExistente) => !idsEnviados.includes(idExistente)
      );

      if (idsAEliminar.length > 0) {
        await condicionsEnvironmental.destroy({
          where: { id: idsAEliminar },
        });
      }
    }

    // 4️⃣ Respuesta final
    const updateEnviron = await Environmental.findByPk(id);
    const condiciones = await condicionsEnvironmental.findAll({
      where: { idEnvironmental: id },
    });

    res.status(200).json({
      message: "Condición ambiental actualizada correctamente",
      environmental: updateEnviron,
      condiciones,
    });
  } catch (error) {
    console.error("Error en updateEnvironmental:", error);
    res.status(500).json({ message: "Ha ocurrido un error" });
  }
};

exports.generateExcel = async (req, res) => {
  try {
    const { id } = req.params;

    // --- Consultas ---
    const sampleData = await Environmental.findOne({ where: { id: id } });
    let sampleApique = await condicionsEnvironmental.findAll({
      where: { idEnvironmental: id },
      order: [["fechaEjecucion", "ASC"], ["hora", "ASC"]],
    });

    const dayjs = require("dayjs");
    require("dayjs/locale/es");
    dayjs.locale("es");

    // Convertir todas las fechas a dayjs
    sampleApique = sampleApique.map(m => ({
      ...m.dataValues,
      fechaEjecucion: dayjs(m.fechaEjecucion)
    }));

    // --- Crear lista única de fechas ---
    const fechasRegistradas = [
      ...new Set(sampleApique.map(m => m.fechaEjecucion.format("YYYY-MM-DD")))
    ].map(f => dayjs(f));

    // Encontrar primera y última fecha
    let primeraFecha = fechasRegistradas[0];
    let ultimaFecha = fechasRegistradas[0];
    fechasRegistradas.forEach(f => {
      if (f.isBefore(primeraFecha)) primeraFecha = f;
      if (f.isAfter(ultimaFecha)) ultimaFecha = f;
    });

    // Ajustar a lunes y viernes
    while (primeraFecha.day() !== 1) {
      primeraFecha = primeraFecha.subtract(1, "day");
    }
    while (ultimaFecha.day() !== 5) {
      ultimaFecha = ultimaFecha.add(1, "day");
    }

    // --- Crear estructura de semanas ---
    const semanas = [];
    let semanaActual = [];
    let fechaIter = primeraFecha.clone();

    while (fechaIter.isBefore(ultimaFecha) || fechaIter.isSame(ultimaFecha, "day")) {
      if (fechaIter.day() >= 1 && fechaIter.day() <= 5) {
        const registrosDia = sampleApique.filter(m =>
          m.fechaEjecucion.isSame(fechaIter, "day")
        );

        // Completar hasta 3 registros
        while (registrosDia.length < 3) {
          registrosDia.push({
            fechaEjecucion: fechaIter.clone(), // siempre dayjs
            hora: "",
            temperatura: "",
            humedad: "",
            firma: "",
            observaciones: ""
          });
        }

        semanaActual.push(...registrosDia);

        // Si ya son 15 filas, cerrar la semana
        if (semanaActual.length === 15) {
          semanas.push(semanaActual);
          semanaActual = [];
        }
      }
      fechaIter = fechaIter.add(1, "day");
    }

    // Si quedó incompleta, rellenar
    if (semanaActual.length > 0) {
      while (semanaActual.length < 15) {
        semanaActual.push({
          fechaEjecucion: null,
          hora: "",
          temperatura: "",
          humedad: "",
          firma: "",
          observaciones: ""
        });
      }
      semanas.push(semanaActual);
    }

    // --- Cargar plantilla ---
    const plantillaPath = path.join(
      __dirname,
      "../public/templates/PlantillaAmbiental.xlsx"
    );
    const plantillaWorkbook = new ExcelJS.Workbook();
    await plantillaWorkbook.xlsx.readFile(plantillaPath);

    const hojaBase = plantillaWorkbook.getWorksheet(
      "Condiciones ambientales (2)"
    );
    if (!hojaBase)
      throw new Error("No se encontró la hoja 'Condiciones ambientales (2)' en la plantilla.");

    // Guardar imágenes
    const imagesInfo = [];
    const hojaImages = typeof hojaBase.getImages === "function" ? hojaBase.getImages() : [];
    const colNumToLetter = (n) => {
      let s = "";
      let num = n;
      while (num >= 0) {
        s = String.fromCharCode((num % 26) + 65) + s;
        num = Math.floor(num / 26) - 1;
      }
      return s;
    };
    const rangeObjToA1 = (rng) => {
      if (!rng) return null;
      if (typeof rng === "string") return rng;
      if (rng.tl && rng.br) {
        const a = `${colNumToLetter(rng.tl.col)}${rng.tl.row + 1}`;
        const b = `${colNumToLetter(rng.br.col)}${rng.br.row + 1}`;
        return `${a}:${b}`;
      }
      return null;
    };
    for (const img of hojaImages) {
      try {
        const imageId = img.imageId;
        const imgData = plantillaWorkbook.getImage(imageId);
        if (imgData && imgData.buffer) {
          imagesInfo.push({
            buffer: imgData.buffer,
            extension: imgData.extension,
            range: rangeObjToA1(img.range) || "A1:C2",
          });
        }
      } catch (err) {
        console.warn("No pude leer una imagen:", err?.message || err);
      }
    }

    // --- Crear nuevo libro ---
    const workbook = new ExcelJS.Workbook();
    const obtenerMerges = (ws) => {
      const merges = new Set();
      if (ws.model && Array.isArray(ws.model.merges)) ws.model.merges.forEach(m => merges.add(m));
      if (ws._merges) {
        if (typeof ws._merges.keys === "function") {
          for (const k of ws._merges.keys()) merges.add(k);
        } else {
          for (const k in ws._merges) merges.add(k);
        }
      }
      return Array.from(merges);
    };
    const clonarHojaCompleta = (nombreHoja) => {
      const nuevaHoja = workbook.addWorksheet(nombreHoja);
      nuevaHoja.properties = { ...(hojaBase.properties || {}) };
      if (hojaBase.pageSetup) nuevaHoja.pageSetup = { ...hojaBase.pageSetup };
      if (hojaBase.views) nuevaHoja.views = hojaBase.views;

      const maxCol = hojaBase.columnCount;
      for (let c = 1; c <= maxCol; c++) {
        const sc = hojaBase.getColumn(c);
        const dc = nuevaHoja.getColumn(c);
        if (sc.width) dc.width = sc.width;
        if (sc.style) dc.style = { ...sc.style };
      }

      const usedMaxRow = hojaBase.rowCount;
      for (let r = 1; r <= usedMaxRow; r++) {
        const row = hojaBase.getRow(r);
        const newRow = nuevaHoja.getRow(r);
        if (row.height) newRow.height = row.height;
        for (let c = 1; c <= maxCol; c++) {
          const cell = row.getCell(c);
          const newCell = newRow.getCell(c);
          newCell.value = cell.value;
          if (cell.style) newCell.style = JSON.parse(JSON.stringify(cell.style));
          if (cell.numFmt) newCell.numFmt = cell.numFmt;
        }
      }

      obtenerMerges(hojaBase).forEach(m => {
        try { nuevaHoja.mergeCells(m); } catch {}
      });

      imagesInfo.forEach(imgInfo => {
        try {
          const newImageId = workbook.addImage({
            buffer: imgInfo.buffer,
            extension: imgInfo.extension,
          });
          nuevaHoja.addImage(newImageId, imgInfo.range);
        } catch {}
      });

      return nuevaHoja;
    };

    // --- Crear hojas por semana ---
    semanas.forEach((semana, index) => {
      const nombre = index === 0 ? hojaBase.name : `Semana ${index + 1}`;
      const worksheet = clonarHojaCompleta(nombre);

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

      // Insertar registros
      const startRow = 12;
      semana.forEach((muestra, i) => {
        const currentRow = startRow + i;
        worksheet.getCell(`B${currentRow}`).value =
          muestra.fechaEjecucion && dayjs.isDayjs(muestra.fechaEjecucion)
            ? muestra.fechaEjecucion.format("YYYY-MM-DD")
            : "";
        worksheet.getCell(`E${currentRow}`).value = muestra.hora;
        worksheet.getCell(`F${currentRow}`).value = muestra.temperatura;
        worksheet.getCell(`H${currentRow}`).value = muestra.humedad;
        worksheet.getCell(`J${currentRow}`).value = muestra.firma;
        worksheet.getCell(`L${currentRow}`).value = muestra.observaciones;
      });
    });

    // --- Responder con archivo ---
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
    res.status(500).json({ error: "Error al generar el Excel", details: error.message });
  }
};
