const Portfolio = require('../models/portfolio');
const User = require('../models/user');
const multer = require('multer');
const { Op }  = require('sequelize');
const fs = require('fs');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
    }
});

// Configuración de multer para múltiples imágenes
const upload = multer({ storage: storage });

exports.getPortfolio = async (req, res) => {
    try {
        const proyect = await Portfolio.findAll();
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
};

exports.getPortfolioActive = async (req,res)=>{
    try {
        const proyect = await Portfolio.findAll({where:{estado:true}});
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los proyectos' });
    }



}



exports.createPortfolio = [
    upload.array('imagenes', 7), // Permite subir hasta 5 imágenes
    async (req, res) => {
        try {
            const { nombre, cliente, ubicacion, presupuesto, descripcion, superficie, detalle } = req.body;

            if ((await Portfolio.findAll({ where: { nombre } })).length>0) {
              return  res.status(400).json({ message: "El nombre del proyecto en el portafolio ya existe" });
            }

            // Verifica si hay archivos subidos
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No se subieron imágenes' });
            }

            // Procesa las imágenes subidas
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
            console.error(error);
            res.status(500).json({ error: 'Error al crear el proyecto' });
        }
    },
];


exports.updatePortfolio = [
    upload.array('imagenes', 7), // Campo modificado para evitar conflicto
    async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, cliente, ubicacion, presupuesto, descripcion, superficie, detalle, imagenesExistentes } = req.body;

            // Validar formato de imágenes existentes
            let imagenesActuales = [];
            try {
                imagenesActuales = imagenesExistentes ? JSON.parse(imagenesExistentes) : [];
                if (!Array.isArray(imagenesActuales)) {
                    throw new Error('Formato de imágenes inválido');
                }
            } catch (parseError) {
                return res.status(400).json({
                    error: 'Error en formato de imágenes',
                    detalles: 'Las imágenes deben ser un arreglo JSON válido'
                });
            }

            // Validar estructura de imágenes
            const isValidImage = img => img?.uri && img?.originalName;
            if (!imagenesActuales.every(isValidImage)) {
                return res.status(400).json({
                    error: 'Estructura de imágenes inválida',
                    detalles: 'Cada imagen debe tener uri y originalName'
                });
            }

            // Verificar nombre único
            const proyectoExistente = await Portfolio.findOne({
                where: {
                    nombre,
                    id: { [Op.ne]: id }
                }
            });
            if (proyectoExistente) {
                return res.status(400).json({ message: "El nombre del proyecto ya está en uso" });
            }

            // Obtener proyecto a actualizar
            const proyecto = await Portfolio.findByPk(id);
            if (!proyecto) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }

            // Procesar nuevas imágenes
            const nuevasImagenes = req.files.map(file => ({
                uri: `/images/${file.filename}`,
                originalName: file.originalname
            }));

            // Combinar y validar cantidad de imágenes
            const totalImagenes = [...imagenesActuales, ...nuevasImagenes];
            if (totalImagenes.length > 7) {
                return res.status(400).json({
                    error: 'Límite de imágenes excedido',
                    detalles: 'Máximo 7 imágenes permitidas'
                });
            }

            // Identificar imágenes a eliminar
            const imagenesOriginales = proyecto.imagenes;
            const urisActuales = totalImagenes.map(img => img.uri);
            const imagenesAEliminar = imagenesOriginales.filter(
                img => !urisActuales.includes(img.uri)
            );

            // Eliminar archivos físicos
            await Promise.all(
                imagenesAEliminar.map(async img => {
                    try {
                        const filePath = path.join(__dirname, '../public', img.uri);
                        await fs.unlinkSync(filePath);
                        console.log(`Imagen eliminada: ${img.uri}`);
                    } catch (error) {
                        console.error(`Error eliminando ${img.uri}:`, error.message);
                    }
                })
            );

            // Actualizar proyecto
            await proyecto.update({
                nombre,
                cliente,
                ubicacion,
                presupuesto,
                descripcion,
                superficie,
                detalle,
                imagenes: totalImagenes
            });

            // Obtener versión actualizada
            const proyectoActualizado = await Portfolio.findByPk(id);
            res.json({ proyecto: proyectoActualizado });

        } catch (error) {
            console.error('Error en updatePortfolio:', error);
            res.status(500).json({
                error: 'Error al actualizar proyecto',
                detalles: error.message
            });
        }
    }
];

/* exports.updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, presupuesto, cliente, ubicacion, superficie, imagenes, detalle } = req.body;
        if (await Portfolio.findAll({ where: { nombre } })) {
            return  res.status(400).json({ message: "El nombre del proyecto en el portafolio ya existe" });
          }
        const proyect = await Portfolio.update({ nombre, descripcion, presupuesto, cliente, ubicacion, superficie, imagenes, detalle }, { where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proyecto', error });
    }
} */

exports.deletePortfolio = async (req, res) => {
    try {
        const id = req.params.id;

        const portafolio = await Portfolio.findOne({ where: { id } });
        if (!portafolio) {
            return res.status(404).json({ error: 'No se encontró el registro' });
        }
        if (portafolio.estado) {
            return res.status(400).json({ message: 'No se puede eliminar un proyecto del portafolio activo' });
        }
        const images = portafolio.imagenes;
        const uploadDir = path.join(__dirname, '../public'); 
        images.forEach((image) => {
            // Construir la ruta completa de la imagen
            const imagePath = path.join(uploadDir, image.uri); // Usar la propiedad "uri" para la ruta de la imagen
            try {
                if (fs.existsSync(imagePath)) { // Verificar si la imagen existe
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
        console.error('Error al eliminar el proyecto del portafolio:', error);
        res.status(500).json({ error: 'Error al eliminar el proyecto del portafolio' });
    }
};


exports.activePortfolio = async (req, res) => {
    try {
        const id = req.params.id;
        const proyect = await Portfolio.update({ estado: true }, { where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al activar el proyecto' });
    }
};


exports.inactivePortfolio = async (req, res) => {
    try {
        const id = req.params.id;
        const proyect = await Portfolio.update({ estado: false }, { where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al inactivar el proyecto' });
    }
}
