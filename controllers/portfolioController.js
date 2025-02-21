const Portfolio = require('../models/portfolio');
const User = require('../models/user');
const multer = require('multer');
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

/* exports.createPortfolio =  async (req, res) => {
    try {
        const { nombre, descripcion, presupuesto, cliente, ubicacion, superficie, imagenes, detalle } = req.body;
        const proyect = await Portfolio.create({ nombre, descripcion, presupuesto, cliente, ubicacion, superficie, imagenes, detalle, estado: true });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el proyecto' });
    }
}; */

exports.createPortfolio = [
    upload.array('imagenes', 5), // Permite subir hasta 5 imágenes
    async (req, res) => {
        try {
            console.log('Body:', req.body); // Depuración: Verifica el cuerpo de la solicitud
            console.log('Files:', req.files); // Depuración: Verifica los archivos subidos

            const { nombre, descripcion, presupuesto, cliente, ubicacion, superficie, detalle } = req.body;

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
                descripcion,
                presupuesto,
                cliente,
                ubicacion,
                superficie,
                imagenes, // Guarda las rutas de las imágenes
                detalle,
                estado: true,
            });

            res.status(200).json(proyect);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el proyecto' });
        }
    }
];

exports.updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, presupuesto, cliente, ubicacion, superficie, imagenes, detalle } = req.body;
        const proyect = await Portfolio.update({ nombre, descripcion, presupuesto, cliente, ubicacion, superficie, imagenes, detalle }, { where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el proyecto', error });
    }
}

exports.deletePortfolio = async (req, res) => {
    try {
        const id = req.params.id;
        const proyect = await Portfolio.destroy({ where: { id } });
        res.status(200).json(proyect);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el proyecto' });
    }
}



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
