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
        return res
          .status(400)
          .json({
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
      console.log(error);
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
        descripcion,
        presupuesto,
        cliente,
        ubicacion,
        superficie,
        detalle,
      } = req.body;
      let existingImages = req.body.existingImages || [];
      if (!Array.isArray(existingImages)) {
        existingImages = [existingImages]; // Asegurar que siempre sea un array
      }
      const proyect = await Portfolio.findByPk(id);
      if (!proyect) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }
      // Obtener imágenes actuales
      let currentImages = proyect.imagenes.map((img) => img.uri);
      // Filtrar imágenes a eliminar (las que ya no están en existingImages)
      const imagesToDelete = currentImages.filter(
        (img) => !existingImages.includes(img)
      );
      // Eliminar archivos de imágenes que ya no están en existingImages
      imagesToDelete.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", "public", imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlink(fullPath, (err) => {
            if (err)
              console.error(`Error al eliminar la imagen ${imgPath}:`, err);
            else console.log(`Imagen eliminada: ${imgPath}`);
          });
        }
      });
      // Agregar nuevas imágenes si hay archivos subidos
      const newImages = req.files.map((file) => ({
        uri: `/images/${file.filename}`,
      }));
      // Crear lista final de imágenes
      const updatedImages = [
        ...existingImages.map((uri) => ({ uri })),
        ...newImages,
      ];
      // Actualizar el proyecto
      await proyect.update({
        nombre,
        descripcion,
        presupuesto,
        cliente,
        ubicacion,
        superficie,
        detalle,
        imagenes: updatedImages,
      });
      res.status(200).json({ message: "Proyecto actualizado", proyect });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el proyecto" });
    }
  },
];

/* exports.updatePortfolio = [
    upload.array('imagenes', 7), 
    async (req, res) => {
      try {
        const { id } = req.params;
        const { nombre, descripcion, presupuesto, cliente, ubicacion, superficie, detalle } = req.body;
        let existingImages = req.body.existingImages || [];
  
        if (!Array.isArray(existingImages)) {
          existingImages = [existingImages]; // Asegurar que siempre sea un array
        }
  
        const proyect = await Portfolio.findByPk(id);
        if (!proyect) {
          return res.status(404).json({ error: "Proyecto no encontrado" });
        }
  
        // Obtener imágenes actuales
        let currentImages = proyect.imagenes.map(img => img.uri);
  
        // Filtrar imágenes a eliminar (las que ya no están en existingImages)
        const imagesToDelete = currentImages.filter(img => !existingImages.includes(img));
  
        // Agregar nuevas imágenes si hay archivos subidos
        const newImages = req.files.map(file => ({ uri: `/images/${file.filename}` }));
  
        // Crear lista final de imágenes
        const updatedImages = [...existingImages.map(uri => ({ uri })), ...newImages];
  
        // Actualizar el proyecto
        await proyect.update({
          nombre,
          descripcion,
          presupuesto,
          cliente,
          ubicacion,
          superficie,
          detalle,
          imagenes: updatedImages,
        });
  
        res.status(200).json({ message: "Proyecto actualizado", proyect });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el proyecto" });
      }
    },
  ]; */

exports.deletePortfolio = async (req, res) => {
  try {
    const id = req.params.id;

    const portafolio = await Portfolio.findOne({ where: { id } });
    if (!portafolio) {
      return res.status(404).json({ error: "No se encontró el registro" });
    }
    if (portafolio.estado) {
      return res
        .status(400)
        .json({
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
