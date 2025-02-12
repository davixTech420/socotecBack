const { DataTypes } = require("sequelize");
const sequelize = require("../config/bd");

const Account = sequelize.define("Account",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
    },
    nombreCuenta:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    tipoCuenta:{
        type:DataTypes.ENUM("Banco","Ahorro","Ingreso","Gasto"),
        allowNull:false,
    },
    entidad:{
        type:DataTypes.ENUM("cliente","proveedor","usuario","departamento"),
        allowNull:false,
    },
    saldo:{
        type:DataTypes.REAL,
    },
    estado:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
    }
});
module.exports = Account;