-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: bamagfwcx7dqg6k5ecnz-mysql.services.clever-cloud.com:3306
-- Tiempo de generación: 06-03-2025 a las 21:53:42
-- Versión del servidor: 8.0.15-5
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bamagfwcx7dqg6k5ecnz`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Accounts`
--

CREATE TABLE `Accounts` (
  `id` int(11) NOT NULL,
  `nombreCuenta` varchar(255) NOT NULL,
  `tipoCuenta` enum('Banco','Ahorro','Ingreso','Gasto') NOT NULL,
  `entidad` enum('cliente','proveedor','usuario','departamento') NOT NULL,
  `saldo` double DEFAULT NULL,
  `estado` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Accounts`
--

INSERT INTO `Accounts` (`id`, `nombreCuenta`, `tipoCuenta`, `entidad`, `saldo`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'Cajamenor', 'Ahorro', 'cliente', 10000000, 1, '2025-03-04 13:50:01', '2025-03-04 15:20:01'),
(2, 'sdfsdfsdf', 'Banco', 'usuario', 3546545646, 1, '2025-03-04 14:08:44', '2025-03-04 15:32:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Employees`
--

CREATE TABLE `Employees` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `cargo` enum('Talento','Ingeniero','Director','Laboratorista','Auxiliar','Arquitecto','TeamLider','DirectorContable') NOT NULL DEFAULT 'Auxiliar',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Employees`
--

INSERT INTO `Employees` (`id`, `userId`, `cargo`, `createdAt`, `updatedAt`) VALUES
(3, 4, 'Auxiliar', '2025-03-03 15:07:13', '2025-03-03 15:07:13'),
(4, 8, 'Auxiliar', '2025-03-03 15:08:03', '2025-03-03 15:08:03'),
(5, 49, 'Auxiliar', '2025-03-03 15:19:01', '2025-03-03 15:19:01'),
(6, 50, 'Ingeniero', '2025-03-03 17:03:34', '2025-03-03 17:03:34'),
(16, 62, 'Auxiliar', '2025-03-04 17:51:16', '2025-03-04 17:51:16'),
(17, 63, 'TeamLider', '2025-03-06 18:02:31', '2025-03-06 18:02:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Groups`
--

CREATE TABLE `Groups` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Groups`
--

INSERT INTO `Groups` (`id`, `nombre`, `descripcion`, `estado`, `createdAt`, `updatedAt`) VALUES
(39, 'Arquitectos', 'arquiectos team lider', 1, '2025-02-12 21:45:13', '2025-02-26 15:44:22'),
(40, 'Talento Humano', 'talento humano', 1, '2025-02-14 14:10:54', '2025-02-26 13:24:28'),
(43, 'metrolinea', 'metal chatarra', 1, '2025-02-21 13:19:39', '2025-02-21 13:19:39'),
(45, 'nuevos', 'adsddasdas', 1, '2025-02-26 15:53:30', '2025-02-26 15:54:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Inventories`
--

CREATE TABLE `Inventories` (
  `id` int(11) NOT NULL,
  `nombreMaterial` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `unidadMedida` varchar(255) NOT NULL,
  `precioUnidad` float NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Inventories`
--

INSERT INTO `Inventories` (`id`, `nombreMaterial`, `descripcion`, `cantidad`, `unidadMedida`, `precioUnidad`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'cemento', 'asdassad', 25, 'CM', 25000, 1, '2025-01-20 21:01:02', '2025-02-27 12:53:57'),
(5, 'porcelana', 'porcelana de color blanco', 300, 'CM', 1500, 1, '2025-01-20 21:45:55', '2025-02-26 16:40:50'),
(9, 'Plastico', 'Plastico fino', 10, 'Cm', 1.989, 1, '2025-01-21 13:36:51', '2025-02-26 16:40:39'),
(14, 'carne', 'carne desmechada', 30, 'CM', 100, 1, '2025-02-05 20:16:37', '2025-02-26 16:40:49'),
(15, 'metalico', 'metal chatarra', 55, 'KILO', 10000, 1, '2025-02-21 13:04:17', '2025-02-21 13:06:42'),
(19, 'nuevos', 'asdasdasd', 3321312, 'asdasd', 231, 1, '2025-02-26 16:37:06', '2025-02-26 16:39:24'),
(20, 'prueba', 'preuba', 3, 'asda', 3000, 1, '2025-02-27 12:37:17', '2025-02-27 12:37:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Motions`
--

CREATE TABLE `Motions` (
  `id` int(11) NOT NULL,
  `tipoMovimiento` enum('transaccion','presupuesto','proyecto') NOT NULL,
  `fecha` date NOT NULL,
  `monto` double NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `cuentaEmisoraId` int(11) NOT NULL,
  `cuentaReceptoraId` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Motions`
--

INSERT INTO `Motions` (`id`, `tipoMovimiento`, `fecha`, `monto`, `descripcion`, `cuentaEmisoraId`, `cuentaReceptoraId`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'transaccion', '2025-03-04', 5000, 'prueba', 1, 2, 1, '2025-03-04 14:24:16', '2025-03-05 13:03:41'),
(2, 'transaccion', '2025-03-04', 5000, 'prueba', 1, 2, 1, '2025-03-04 15:45:39', '2025-03-04 15:45:39'),
(3, 'proyecto', '2025-01-22', 55456, 'uyiiuui', 1, 2, 1, '2025-03-04 15:46:22', '2025-03-04 15:46:22'),
(4, 'presupuesto', '2024-02-22', 2342343242, 'asdsadasdsadsad', 2, 1, 1, '2025-03-04 15:47:21', '2025-03-04 15:47:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Permissions`
--

CREATE TABLE `Permissions` (
  `id` int(11) NOT NULL,
  `solicitanteId` int(11) NOT NULL,
  `aprobadorId` int(11) DEFAULT NULL,
  `tipoPermiso` enum('Vacaciones','Medico','Personal') NOT NULL DEFAULT 'Personal',
  `fechaInicio` date NOT NULL,
  `fechaFin` date DEFAULT NULL,
  `estado` enum('Pendiente','Aprobado','Rechazado') NOT NULL DEFAULT 'Pendiente',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Permissions`
--

INSERT INTO `Permissions` (`id`, `solicitanteId`, `aprobadorId`, `tipoPermiso`, `fechaInicio`, `fechaFin`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 1, 3, 'Vacaciones', '2023-03-01', '2023-03-02', 'Rechazado', '2025-01-24 19:56:18', '2025-03-05 14:14:54'),
(2, 1, 3, 'Vacaciones', '2023-03-01', '2023-03-02', 'Pendiente', '2025-01-24 19:58:44', '2025-03-05 14:15:03'),
(7, 8, 9, 'Vacaciones', '2025-03-26', '2025-04-01', 'Aprobado', '2025-03-04 20:26:34', '2025-03-05 15:00:50'),
(9, 3, 9, 'Personal', '2025-03-26', '2025-03-13', 'Rechazado', '2025-03-05 12:28:09', '2025-03-05 17:31:34'),
(10, 3, 3, 'Vacaciones', '2023-03-01', '2023-03-02', 'Aprobado', '2025-03-05 13:15:00', '2025-03-05 17:31:41'),
(11, 1, 9, 'Vacaciones', '2025-04-02', '2025-04-05', 'Pendiente', '2025-03-05 14:59:41', '2025-03-05 14:59:41'),
(12, 63, 9, 'Personal', '2025-03-06', '2025-04-01', 'Aprobado', '2025-03-06 19:40:03', '2025-03-06 20:39:40'),
(13, 63, NULL, 'Medico', '2025-03-26', '2025-03-20', 'Pendiente', '2025-03-06 19:48:31', '2025-03-06 19:48:31'),
(14, 63, NULL, 'Vacaciones', '2025-03-25', '2025-03-27', 'Pendiente', '2025-03-06 19:55:52', '2025-03-06 19:55:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Portfolios`
--

CREATE TABLE `Portfolios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `cliente` varchar(255) NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `presupuesto` float NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `superficie` varchar(255) NOT NULL,
  `imagenes` json NOT NULL,
  `detalle` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Portfolios`
--

INSERT INTO `Portfolios` (`id`, `nombre`, `cliente`, `ubicacion`, `presupuesto`, `descripcion`, `superficie`, `imagenes`, `detalle`, `estado`, `createdAt`, `updatedAt`) VALUES
(35, 'Sena', 'sena', 'asdasdasd', 2323, 'asdsdas', 'asdasds', '[{\"uri\": \"/images/1740429003226\", \"originalName\": \"xphJAJhcsrBYgOLPoJCuT1AJCpp5EEoAT3vZkLQHw5Y9XMTYx+n8lG7VYQIfhWQAAAABJRU5ErkJggg==\"}]', 'asdasd', 1, '2025-02-24 20:30:03', '2025-03-04 21:39:30'),
(37, 'sdfsdfsd', 'dsfdsf', 'dsfsdfsd', 234, 'dsfsdfsdf', 'sdfsdfsdf', '[{\"uri\": \"/images/1740500767123\", \"originalName\": \"tx9Hwo15zCpQ4Dk5bSqZEVuXR6P8PpTNYF7KfM5IAAAAASUVORK5CYII=\"}, {\"uri\": \"/images/1740500767131\", \"originalName\": \"9a9euXbFo165du3bt2rVr165du3bt2vVU6NKlbwHdlRZoPWpPIgAAAABJRU5ErkJggg==\"}, {\"uri\": \"/images/1740500767136\", \"originalName\": \"S9tcu3mnagghCQm19p3ooJ0gZ4biwfaw6+gExIj5don1aVjJU+yQSVPyFoj127eiQpCSGJyrX0nKgghiUm59kl1oZKvHlTyhKw1cu3mnagghCQm19p3ooIQkpiUa59Ul6Ghof8f2g2ZrCQmTR8AAAAASUVORK5CYII=\"}]', 'sdfsdfsd', 1, '2025-02-25 16:26:07', '2025-03-04 21:39:26'),
(38, 'Sena', 'seaa', 'dasdas', 34234, 'asdasd', 'asdasd', '[{\"uri\": \"/images/1740668356062\", \"originalName\": \"9k=\"}, {\"uri\": \"/images/1740668356063\", \"originalName\": \"9k=\"}]', 'sdasd', 1, '2025-02-27 14:59:16', '2025-02-27 14:59:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Proyects`
--

CREATE TABLE `Proyects` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `presupuesto` float NOT NULL,
  `cliente` varchar(255) NOT NULL,
  `fechaInicio` date NOT NULL,
  `fechaEntrega` date NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `groupId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Proyects`
--

INSERT INTO `Proyects` (`id`, `nombre`, `descripcion`, `presupuesto`, `cliente`, `fechaInicio`, `fechaEntrega`, `estado`, `createdAt`, `updatedAt`, `groupId`) VALUES
(4, 'proyectto', 'sadasdasd', 3242420, 'seba', '2025-02-12', '2025-02-28', 1, '2025-02-12 20:56:15', '2025-02-12 20:56:15', NULL),
(5, 'metrolinea1', 'la linea del metro uno sobre la av caracas', 5000000, 'secretaria movilidad', '2025-02-28', '2025-02-22', 1, '2025-02-21 13:33:17', '2025-02-21 13:33:17', 40);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `role` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `Users`
--

INSERT INTO `Users` (`id`, `nombre`, `telefono`, `email`, `password`, `estado`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'cristhian', '3242855700', 'cristhian.garcia@socotec.com', '$2a$10$H/ifkxVuUTV2kP3spiePVu7gUQf0x7jo3x4cEfTwuqQDbWhGg6Z0e', 1, 'admin', '2025-01-20 14:33:24', '2025-03-03 17:56:05'),
(3, 'Nayabe', '3256546550', 'nayabe@socotec.com', '$2a$10$sYrZTSsklsJbEhJkA3KJQu/mAOFHvT97x14wpSzhvGqnZn3Mhrpxq', 1, 'employee', '2025-01-24 15:02:21', '2025-02-26 14:30:05'),
(4, 'Pruebasas', '3495995649', 'pruebas@socotec.com', '$2a$10$nHeA6HI6DYP9xAeGWNzwZeEqp996j6t8rGCUvf9IELKmCbr6MwhW2', 1, 'employee', '2025-01-24 15:46:55', '2025-03-03 15:07:14'),
(8, 'samir', '3142343242', 'samir@socotec.com', '$2a$10$FTF6WvZOKP1zFxca3Hp1QOiVHzSDNMawzQr4UEm3SemBSz40YFIuS', 1, 'employee', '2025-01-29 22:12:23', '2025-03-03 15:08:03'),
(9, 'Lina', '3195959949', 'lina@socotec.com', '$2a$10$f.9THDyhzlY1UfiycQevbOuE/x5wPoIy25YPXYZiJ0CMijKN2EuvS', 1, 'admin', '2025-01-29 22:13:45', '2025-03-03 18:04:27'),
(12, 'enrique', '3153465343', 'enrique@socotec.com', '$2a$10$KViUJqQ0GwU3VzbmzvR6pu78HDhuTyeMcDzncOa0IJsQGXwDnslWa', 1, 'employee', '2025-01-29 22:26:15', '2025-02-26 13:07:27'),
(13, 'Carlos', '3194956646', 'Carlos@socotec.com', '$2a$10$GwRLmX.QjFLRD0epGS0NseigfVlruTMJrVQTcJSIG1cXr0i.qidKi', 1, 'employee', '2025-01-30 16:55:37', '2025-02-26 13:07:31'),
(14, 'comoes', '3645641354', 'comoes@socotec.com', '$2a$10$mhlZ0DobXYZSdkLxBeZRauTV4dBKNf5nErWdzs.W60KJ61ePc8wqC', 1, 'employee', '2025-01-30 19:06:22', '2025-02-27 12:57:58'),
(38, 'camilo', '3123234325', 'camilo.gomez@socotec.com', '$2a$10$CFuZC5i8UOAtczyYea5yV.9rKrsskKcjJr2mnXSn4QAx19O.hnd12', 1, 'admin', '2025-01-31 14:11:29', '2025-02-28 16:27:30'),
(41, 'jose', '3248564648', 'jose.gomez@socotec.com', '$2a$10$tzEbIUHdksTZLMYsl3x57ewte74LiIpd4WJCZq1RVA0ZeLwaOhPum', 1, 'admin', '2025-02-20 16:27:06', '2025-03-03 15:06:46'),
(43, 'geraldin', '3102546879', 'geraldin@socotec.com', '$2a$10$g6eunFCZTBaFA2NE39m8VeoscPUaPqvZvqrVr0ehVVf3taXoOn51i', 1, 'employee', '2025-02-21 14:40:17', '2025-02-27 12:58:05'),
(47, 'prueba', '3212315475', 'prueba@socotec.com', '$2a$10$Tm1O3T5vSGeHzXRWZ1ueD.d1QFFev1yYlcKBfvhLsjxj2oxeh0Hau', 1, 'employee', '2025-03-03 14:38:43', '2025-03-03 15:03:43'),
(49, 'diana', '3185466748', 'diana.hoyos@socotec.com', '$2a$10$hpZIT50E3oYovLbzWHUr5ehCR6I44m301iEDgRzUxpzOkcJCmiOWS', 1, 'employee', '2025-03-03 15:18:59', '2025-03-03 15:18:59'),
(50, 'ingenier', '3130486640', 'inge.pru@socotec.com', '12345678', 1, 'employee', '2025-03-03 17:03:32', '2025-03-03 19:10:25'),
(52, 'asdasd', '3213213123', 'asdfsfdasd@socotec.com', '12345678', 1, 'employee', '2025-03-03 17:06:11', '2025-03-03 19:11:19'),
(62, 'Laura', '3249495648', 'laura.chacon@socotec.com', '$2a$10$Lsknw9APE4pwzmeLLhNSE.KQ7pjAgJkjH6f7w2LESGABoq/fNre/2', 0, 'employee', '2025-03-04 17:51:14', '2025-03-04 21:01:47'),
(63, 'jessica', '3242864564', 'jessica.moreno@socotec.com', '$2a$10$.v2dDV5AHSGVVHT2CsbMO.PYULyVGbmotrdgFrdmeTnEQ7CaH4ydy', 1, 'employee', '2025-03-06 18:02:29', '2025-03-06 18:06:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `UsersGroups`
--

CREATE TABLE `UsersGroups` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `groupId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `UsersGroups`
--

INSERT INTO `UsersGroups` (`id`, `userId`, `createdAt`, `updatedAt`, `groupId`) VALUES
(46, 4, '2025-02-12 21:45:15', '2025-02-12 21:45:15', 39),
(47, 8, '2025-02-14 14:10:54', '2025-02-14 14:10:54', 40),
(48, 9, '2025-02-14 14:10:54', '2025-02-14 14:10:54', 40),
(53, 1, '2025-02-26 12:54:53', '2025-02-26 12:54:53', 40),
(54, 3, '2025-02-26 12:54:53', '2025-02-26 12:54:53', 40),
(56, 13, '2025-03-05 16:12:18', '2025-03-05 16:12:18', 45),
(57, 14, '2025-03-05 16:12:18', '2025-03-05 16:12:18', 45),
(58, 50, '2025-03-05 16:12:18', '2025-03-05 16:12:18', 45);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Accounts`
--
ALTER TABLE `Accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `nombreCuenta` (`nombreCuenta`),
  ADD UNIQUE KEY `nombreCuenta_2` (`nombreCuenta`),
  ADD UNIQUE KEY `nombreCuenta_3` (`nombreCuenta`),
  ADD UNIQUE KEY `nombreCuenta_4` (`nombreCuenta`),
  ADD UNIQUE KEY `nombreCuenta_5` (`nombreCuenta`),
  ADD UNIQUE KEY `nombreCuenta_6` (`nombreCuenta`),
  ADD UNIQUE KEY `nombreCuenta_7` (`nombreCuenta`),
  ADD UNIQUE KEY `nombreCuenta_8` (`nombreCuenta`);

--
-- Indices de la tabla `Employees`
--
ALTER TABLE `Employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indices de la tabla `Groups`
--
ALTER TABLE `Groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`),
  ADD UNIQUE KEY `nombre_3` (`nombre`),
  ADD UNIQUE KEY `nombre_4` (`nombre`),
  ADD UNIQUE KEY `nombre_5` (`nombre`),
  ADD UNIQUE KEY `nombre_6` (`nombre`),
  ADD UNIQUE KEY `nombre_7` (`nombre`),
  ADD UNIQUE KEY `nombre_8` (`nombre`),
  ADD UNIQUE KEY `nombre_9` (`nombre`),
  ADD UNIQUE KEY `nombre_10` (`nombre`),
  ADD UNIQUE KEY `nombre_11` (`nombre`),
  ADD UNIQUE KEY `nombre_12` (`nombre`),
  ADD UNIQUE KEY `nombre_13` (`nombre`),
  ADD UNIQUE KEY `nombre_14` (`nombre`),
  ADD UNIQUE KEY `nombre_15` (`nombre`),
  ADD UNIQUE KEY `nombre_16` (`nombre`),
  ADD UNIQUE KEY `nombre_17` (`nombre`),
  ADD UNIQUE KEY `nombre_18` (`nombre`),
  ADD UNIQUE KEY `nombre_19` (`nombre`);

--
-- Indices de la tabla `Inventories`
--
ALTER TABLE `Inventories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `nombreMaterial` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_2` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_3` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_4` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_5` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_6` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_7` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_8` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_9` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_10` (`nombreMaterial`),
  ADD UNIQUE KEY `nombreMaterial_11` (`nombreMaterial`);

--
-- Indices de la tabla `Motions`
--
ALTER TABLE `Motions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `cuentaEmisoraId` (`cuentaEmisoraId`),
  ADD KEY `cuentaReceptoraId` (`cuentaReceptoraId`);

--
-- Indices de la tabla `Permissions`
--
ALTER TABLE `Permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `solicitanteId` (`solicitanteId`),
  ADD KEY `aprobadorId` (`aprobadorId`);

--
-- Indices de la tabla `Portfolios`
--
ALTER TABLE `Portfolios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `Proyects`
--
ALTER TABLE `Proyects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `nombre_2` (`nombre`),
  ADD UNIQUE KEY `nombre_3` (`nombre`),
  ADD UNIQUE KEY `nombre_4` (`nombre`),
  ADD UNIQUE KEY `nombre_5` (`nombre`),
  ADD UNIQUE KEY `nombre_6` (`nombre`),
  ADD UNIQUE KEY `nombre_7` (`nombre`),
  ADD UNIQUE KEY `nombre_8` (`nombre`),
  ADD UNIQUE KEY `nombre_9` (`nombre`),
  ADD UNIQUE KEY `nombre_10` (`nombre`),
  ADD UNIQUE KEY `nombre_11` (`nombre`),
  ADD UNIQUE KEY `nombre_12` (`nombre`),
  ADD UNIQUE KEY `nombre_13` (`nombre`),
  ADD UNIQUE KEY `nombre_14` (`nombre`),
  ADD UNIQUE KEY `nombre_15` (`nombre`),
  ADD UNIQUE KEY `nombre_16` (`nombre`),
  ADD KEY `groupId` (`groupId`);

--
-- Indices de la tabla `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `telefono` (`telefono`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telefono_2` (`telefono`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `telefono_3` (`telefono`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `telefono_4` (`telefono`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `telefono_5` (`telefono`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `telefono_6` (`telefono`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `telefono_7` (`telefono`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `telefono_8` (`telefono`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `telefono_9` (`telefono`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `telefono_10` (`telefono`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `telefono_11` (`telefono`),
  ADD UNIQUE KEY `telefono_12` (`telefono`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `telefono_13` (`telefono`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `telefono_14` (`telefono`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `telefono_15` (`telefono`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `telefono_16` (`telefono`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `telefono_17` (`telefono`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `telefono_18` (`telefono`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `telefono_19` (`telefono`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `telefono_20` (`telefono`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `telefono_21` (`telefono`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `telefono_22` (`telefono`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `telefono_23` (`telefono`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `telefono_24` (`telefono`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `telefono_25` (`telefono`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `telefono_26` (`telefono`),
  ADD UNIQUE KEY `email_25` (`email`);

--
-- Indices de la tabla `UsersGroups`
--
ALTER TABLE `UsersGroups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `groupId` (`groupId`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Accounts`
--
ALTER TABLE `Accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `Employees`
--
ALTER TABLE `Employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `Groups`
--
ALTER TABLE `Groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `Inventories`
--
ALTER TABLE `Inventories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `Motions`
--
ALTER TABLE `Motions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `Permissions`
--
ALTER TABLE `Permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `Portfolios`
--
ALTER TABLE `Portfolios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `Proyects`
--
ALTER TABLE `Proyects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `UsersGroups`
--
ALTER TABLE `UsersGroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Employees`
--
ALTER TABLE `Employees`
  ADD CONSTRAINT `Employees_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`);

--
-- Filtros para la tabla `Motions`
--
ALTER TABLE `Motions`
  ADD CONSTRAINT `Motions_ibfk_1` FOREIGN KEY (`cuentaEmisoraId`) REFERENCES `Accounts` (`id`),
  ADD CONSTRAINT `Motions_ibfk_2` FOREIGN KEY (`cuentaReceptoraId`) REFERENCES `Accounts` (`id`);

--
-- Filtros para la tabla `Permissions`
--
ALTER TABLE `Permissions`
  ADD CONSTRAINT `Permissions_ibfk_1` FOREIGN KEY (`solicitanteId`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `Permissions_ibfk_2` FOREIGN KEY (`aprobadorId`) REFERENCES `Users` (`id`);

--
-- Filtros para la tabla `Proyects`
--
ALTER TABLE `Proyects`
  ADD CONSTRAINT `Proyects_ibfk_1` FOREIGN KEY (`groupId`) REFERENCES `Groups` (`id`);

--
-- Filtros para la tabla `UsersGroups`
--
ALTER TABLE `UsersGroups`
  ADD CONSTRAINT `UsersGroups_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `UsersGroups_ibfk_22` FOREIGN KEY (`groupId`) REFERENCES `Groups` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;