const Portfolio = require("../models/portfolio");
const User = require("../models/user");
const multer = require("multer");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Carpeta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  },
});

// Configuración de multer para múltiples imágenes
const upload = multer({ storage: storage });

exports.getPortfolio = async (req, res) => {
  try {
    const proyect = await Portfolio.findAll();
    res.status(200).json(proyect);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los proyectos" });
  }
};


exports.getPortfolioActive = async (req, res) => {
  try {
    const proyect = await Portfolio.findAll({ where: { estado: true } });
    res.status(200).json(proyect);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los proyectos" });
  }
};


exports.createPortfolio = [
  upload.array("imagenes", 7), // Permite subir hasta 5 imágenes
  async (req, res) => {
    try {
      const {
        nombre,
        cliente,
        ubicacion,
        presupuesto,
        descripcion,
        superficie,
        detalle,
      } = req.body;
      if ((await Portfolio.findAll({ where: { nombre } })).length > 0) {
        return res.status(400).json({
          message: "El nombre del proyecto en el portafolio ya existe",
        });
      }

      // Verifica si hay archivos subidos
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No se subieron imágenes" });
      }

      const imagenes = req.files.map((file) => {
        return {
          uri: `/images/${file.filename}`, // Ruta pública de la imagen
          originalName: file.originalname,
        };
      });

      // Crea el proyecto en la base de datos
      const proyect = await Portfolio.create({
        nombre,
        cliente,
        ubicacion,
        presupuesto,
        descripcion,
        superficie,
        detalle,
        imagenes, // Guarda las rutas de las imágenes
        estado: true,
      });
      res.status(200).json({ proyect });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el proyecto", error });
    }
  },
];


exports.updatePortfolio = [
  upload.array("imagenes", 7),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nombre,
        cliente,
        ubicacion,
        presupuesto,
        descripcion,
        superficie,
        detalle,
        imagenes: existingImages = [],
      } = req.body;

      // Asegurar que existingImages sea un array
      const parsedExistingImages = Array.isArray(existingImages)
        ? existingImages
        : existingImages
        ? [existingImages]
        : [];

      // Buscar el proyecto existente
      const proyecto = await Portfolio.findOne({ where: { id } });
      if (!proyecto) {
        return res.status(404).json({ error: "Portafolio no encontrado" });
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
            uri: `/images/${file.filename}`,
            originalName: file.originalname,
          }))
        : [];

      // 3. Combinar imágenes existentes (que se mantienen) con nuevas
      const finalImages = [
        ...currentImages.filter((img) => imagesToKeep.includes(img.uri)),
        ...newImages,
      ];

      // Actualizar el proyecto en la base de datos
      const [updated] = await Portfolio.update(
        {
          nombre,
          cliente,
          ubicacion,
          presupuesto,
          descripcion,
          superficie,
          detalle,
          imagenes: finalImages,
        },
        { where: { id } }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ error: "No se pudo actualizar el apique" });
      }

      // Obtener el proyecto actualizado para devolverlo
      const updatedApique = await Portfolio.findOne({ where: { id } });
      res.status(200).json({
        message: "Portafolio actualizado correctamente",
        apique: updatedApique,
      });
    } catch (error) {
      console.error("Error al actualizar portafolio:", error);
      res.status(500).json({
        error: "Error al actualizar el proyecto",
        details: error.message,
      });
    }
  },
];


exports.deletePortfolio = async (req, res) => {
  try {
    const id = req.params.id;

    const portafolio = await Portfolio.findOne({ where: { id } });
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
    const proyect = await Portfolio.destroy({ where: { id } });
    res.status(200).json(proyect);
  } catch (error) {
    console.error("Error al eliminar el proyecto del portafolio:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar el proyecto del portafolio" });
  }
};

exports.activePortfolio = async (req, res) => {
  try {
    const id = req.params.id;
    const proyect = await Portfolio.update({ estado: true }, { where: { id } });
    res.status(200).json(proyect);
  } catch (error) {
    res.status(500).json({ error: "Error al activar el proyecto" });
  }
};

exports.inactivePortfolio = async (req, res) => {
  try {
    const id = req.params.id;
    const proyect = await Portfolio.update(
      { estado: false },
      { where: { id } }
    );
    res.status(200).json(proyect);
  } catch (error) {
    res.status(500).json({ error: "Error al inactivar el proyecto" });
  }
};
