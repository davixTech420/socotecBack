const { body,validationResult } = require('express-validator');

const validationSchemas = {
    users: {
        nombre: body('nombre')
            .notEmpty()
            .withMessage('El nombre no puede estar vacío.')
            .isString()
            .withMessage('El nombre debe ser una cadena de texto.')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('El nombre solo puede contener letras y espacios.'),
        telefono: body('telefono')
            .isLength({ min: 10, max: 10 })
            .withMessage('El número de teléfono debe tener exactamente 10 dígitos.')
            .isNumeric()
            .withMessage('El número de teléfono debe contener solo números.'),
        email: body('email')
            .notEmpty()
            .withMessage('El correo electrónico no puede estar vacío.')
            .isEmail()
            .withMessage('Debe proporcionar un correo electrónico válido.')
            .custom(value => {
                if (!value.endsWith('@socotec.com')) {
                    throw new Error('El correo electrónico debe ser del dominio @socotec.com');
                }
                return true;
            }),
        password: body('password')
            .isLength({ min: 8 })
            .withMessage('La contraseña debe tener al menos 8 caracteres.')
    },
    products: {
        name: body('name')
            .isString()
            .withMessage('El nombre debe ser una cadena de texto.'),
        price: body('price')
            .isFloat({ min: 0 })
            .withMessage('El precio debe ser un número positivo.'),
        // Agrega más campos aquí
    },
    // Agrega más tablas aquí
};




const validate = (table) => {
    const schema = validationSchemas[table];
    if (!schema) {
        throw new Error(`No se encontró un esquema de validación para la tabla ${table}`);
    }
    return [
        ...Object.values(schema), // Aplica todas las validaciones del esquema
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];
};

module.exports = validate;