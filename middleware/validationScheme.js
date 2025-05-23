const { body, validationResult } = require("express-validator");

const validationSchemas = {
  users: {
    nombre: body("nombre")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .isString()
      .withMessage("El nombre debe ser una cadena de texto.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("El nombre solo puede contener letras y espacios."),
    telefono: body("telefono")
      .isLength({ min: 10, max: 10 })
      .withMessage("El número de teléfono debe tener exactamente 10 dígitos.")
      .isNumeric()
      .withMessage("El número de teléfono debe contener solo números."),
    email: body("email")
      .notEmpty()
      .withMessage("El correo electrónico no puede estar vacío.")
      .isEmail()
      .withMessage("Debe proporcionar un correo electrónico válido.")
      .custom((value) => {
        if (!value.endsWith("@socotec.com")) {
          throw new Error(
            "El correo electrónico debe ser del dominio @socotec.com"
          );
        }
        return true;
      }),
    password: body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres."),
  },
  login: {
    email: body("email")
      .notEmpty()
      .withMessage("El correo electrónico no puede estar vacío.")
      .isEmail()
      .withMessage("Debe proporcionar un correo electrónico válido.")
      .custom((value) => {
        if (!value.endsWith("@socotec.com")) {
          throw new Error(
            "El correo electrónico debe ser del dominio @socotec.com"
          );
        }
        return true;
      }),
    password: body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres."),
  },
  emailPass: {
    email: body("email")
      .notEmpty()
      .withMessage("El correo electrónico no puede estar vacío.")
      .isEmail()
      .withMessage("Debe proporcionar un correo electrónico válido.")
      .custom((value) => {
        if (!value.endsWith("@socotec.com")) {
          throw new Error(
            "El correo electrónico debe ser del dominio @socotec.com"
          );
        }
        return true;
      }),
  },
  forgotPassword: {
    password: body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres."),
    token: body("token")
      .notEmpty()
      .withMessage("El token no puede estar vacío."),
  },
  inventory: {
    nombreMaterial: body("nombreMaterial")
      .isString()
      .notEmpty()
      .withMessage("El nombre debe ser una cadena de texto."),
    descripcion: body("descripcion")
      .notEmpty()
      .withMessage("La descripcion no puedo estar vacia."),
    cantidad: body("cantidad")
      .notEmpty()
      .isNumeric()
      .withMessage("La cantidad debe ser un número."),
    unidadMedida: body("unidadMedida")
      .notEmpty()
      .isString()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("La unidad de medida debe ser una cadena de texto."),
    precioUnidad: body("precioUnidad")
      .notEmpty()
      .isFloat()
      .withMessage("El precio de la unidad debe ser un número."),
  },
  group: {
    nombre: body("nombre")
      .notEmpty()
      .isString()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage(
        "El nombre no puede estar vacío y debe ser una cadena de texto."
      ),
    descripcion: body("descripcion")
      .notEmpty()
      .withMessage("La descripcion no puede estar vacia."),
    usuarios: body("usuarios")
      .notEmpty()
      .withMessage("Los usuarios no pueden estar vacios."),
  },
  proyect: {
    nombre: body("nombre")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío."),
    descripcion: body("descripcion")
      .notEmpty()
      .withMessage("La descripcion no puede estar vacia."),
    presupuesto: body("presupuesto")
      .notEmpty()
      .isFloat()
      .withMessage("El presupuesto no puede estar vacío y debe ser un número."),
    cliente: body("cliente")
      .notEmpty()
      .withMessage("El cliente no puede estar vacío."),
    fechaInicio: body("fechaInicio")
      .notEmpty()
      .isDate()
      .withMessage("La fecha de inicio no puede estar vacía."),
    fechaEntrega: body("fechaEntrega")
      .notEmpty()
      .isDate()
      .withMessage("La fecha de entrega no puede estar vacía."),
  },
  permission: {
    solicitanteId: body("solicitanteId")
      .notEmpty()
      .isNumeric()
      .withMessage("El solicitante no puede estar vacío y debe ser un numero."),
    tipoPermiso: body("tipoPermiso")
      .notEmpty()
      .isIn(["Vacaciones", "Medico", "Personal"])
      .withMessage(
        "El tipo de permiso no puede estar vacío y debe ser una de las opciones."
      ),
    fechaInicio: body("fechaInicio")
      .notEmpty()
      .isDate()
      .withMessage("La fecha de inicio no puede estar vacía."),
    fechaFin: body("fechaFin")
      .notEmpty()
      .isDate()
      .withMessage("La fecha de fin no puede estar vacía."),
  },
  portfolio: {
    nombre: body("nombre")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío."),
    cliente: body("cliente")
      .notEmpty()
      .withMessage("El cliente no puede estar vacío."),
    ubicacion: body("ubicacion")
      .notEmpty()
      .withMessage("La ubicación no puede estar vacío."),
    presupuesto: body("presupuesto")
      .notEmpty()
      .isFloat()
      .withMessage(
        "El presupuesto no puede estar vacío y debe de ser numeros."
      ),
    descripcion: body("descripcion")
      .notEmpty()
      .withMessage("La descripcion no puede estar vacia"),
    superficie: body("superficie")
      .notEmpty()
      .withMessage("La superficie no puede estar vacia "),
  },
  account: {
    nombreCuenta: body("nombreCuenta")
      .isString()
      .matches(/^[A-Za-z\s]+$/)
      .notEmpty()
      .withMessage("El nombre de la cuenta no puede estar vacío."),
    tipoCuenta: body("tipoCuenta")
      .notEmpty()
      .withMessage("El tipo de cuenta no puede estar vacío."),
    entidad: body("entidad")
      .notEmpty()
      .withMessage("La entidad no puede estar vacía."),
    saldo: body("saldo")
      .notEmpty()
      .isNumeric()
      .withMessage("El saldo no puede estar vacío y debe ser un número."),
  },
  motions: {
    tipoMovimiento: body("tipoMovimiento")
      .notEmpty()
      .withMessage("El tipo de movimiento no puede estar vacío."),
    fecha: body("fecha")
      .notEmpty()
      .isDate()
      .withMessage("La fecha no puede estar vacía."),
    monto: body("monto")
      .notEmpty()
      .isNumeric()
      .withMessage("El monto no puede estar vacío y debe ser un número."),
    descripcion: body("descripcion")
      .notEmpty()
      .withMessage("La descripción no puede estar vacía."),
    cuentaEmisoraId: body("cuentaEmisoraId")
      .notEmpty()
      .isNumeric()
      .withMessage(
        "La cuenta emisora no puede estar vacía y debe ser un número."
      ),
  },
  hiring: {
    nombre: body("nombre")
      .notEmpty()
      .withMessage("El nombre no puede estar vacío.")
      .isString()
      .withMessage("El nombre debe ser una cadena de texto.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("El nombre solo puede contener letras y espacios."),
    telefono: body("telefono")
      .isLength({ min: 10, max: 10 })
      .withMessage("El número de teléfono debe tener exactamente 10 dígitos.")
      .isNumeric()
      .withMessage("El número de teléfono debe contener solo números."),
    email: body("email")
      .notEmpty()
      .withMessage("El correo electrónico no puede estar vacío.")
      .isEmail()
      .withMessage("Debe proporcionar un correo electrónico válido."),
    salario: body("salario")
      .notEmpty()
      .isFloat()
      .withMessage("El Salario solo pueden ser numeros"),
    cargo: body("cargo")
      .notEmpty()
      .withMessage("El Cargo no puede estar vacio"),
    tipoContrato: body("tipoContrato")
      .notEmpty()
      .withMessage("El tipo de contrato no puede estar vacio"),
    estado: body("estado")
      .notEmpty()
      .withMessage("El estado no puede estar vacio"),
  },
  assignment: {
    inventoryId: body("inventoryId")
      .notEmpty()
      .withMessage("El inventario no puede estar vacío.")
      .isNumeric()
      .withMessage("El inventario debe ser un numero."),
    userId: body("userId")
      .notEmpty()
      .withMessage("El Usuario no puede estar vacio")
      .isNumeric()
      .withMessage("El usuario debe ser un numero"),
    asignadorId: body("asignadorId")
      .notEmpty()
      .withMessage("El asignador no puede estar vacío.")
      .isNumeric()
      .withMessage("El Asignador debe ser un numero"),
    estado: body("estado")
      .notEmpty()
      .withMessage("El estado no puede estar vacio"),
  },
  ticket: {
    userId: body("userId")
      .notEmpty()
      .withMessage("El inventario no puede estar vacío.")
      .isNumeric()
      .withMessage("El inventario debe ser un numero."),
    sitio: body("sitio")
      .notEmpty()
      .withMessage("El Sitio no puede estar vacio"),
    remoto: body("remoto")
      .notEmpty()
      .withMessage("El remoto no puede estar vacío."),
    descripcion: body("descripcion")
      .notEmpty()
      .withMessage("la descripcion no puede estar vacío."),
  },
  task: {
    asignadorId: body("asignadoId")
      .notEmpty()
      .withMessage("El asignador no puede estar vacío.")
      .isNumeric()
      .withMessage("El asignador debe ser un numero."),
    titulo: body("titulo")
      .notEmpty()
      .withMessage("El titulo no puede estar vacio"),
    descripcion: body("descripcion")
      .notEmpty()
      .withMessage("El asignador no puede estar vacío."),
  },
  // Agrega más tablas aquí
};

const validate = (table) => {
  const schema = validationSchemas[table];
  if (!schema) {
    throw new Error(
      `No se encontró un esquema de validación para la tabla ${table}`
    );
  }
  return [
    ...Object.values(schema), // Aplica todas las validaciones del esquema
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

module.exports = validate;