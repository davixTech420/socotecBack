const Hiring = require("../models/hiring");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

exports.getHiring = async (req, res) => {
  try {
    const hiring = await Hiring.findAll();
    res.status(200).json(hiring);
  } catch (error) {
    res.status(500).json({
      message: "Ha Ocurrido Un Error Al Obtener Los Candidatos",
      error,
    });
  }
};
exports.createHiring = async (req, res) => {
  try {
    const {
      nombre,
      email,
      telefono,
      cargo,
      tipoContrato,
      estado,
      salario,
      cita,
      nota,
    } = req.body;

    const hiring = await Hiring.create({
      nombre,
      email,
      telefono,
      cargo,
      tipoContrato,
      estado,
      salario,
      cita,
      nota,
    });
    res.status(201).json({ message: "Se Ha Creado Con Exito", hiring });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Crear Candidato" });
  }
};

exports.updateHiring = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      email,
      telefono,
      cargo,
      tipoContrato,
      estado,
      salario,
      cita,
      nota,
    } = req.body;

    // Actualizar el registro
    const hiring = await Hiring.update(
      {
        nombre,
        email,
        telefono,
        cargo,
        tipoContrato,
        estado,
        salario,
        cita,
        nota,
      },
      { where: { id } }
    );

    // Configurar OAuth2 para Gmail
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    const accessToken = await oAuth2Client.getAccessToken();

    // Configurar transporter de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cristhiandavidamaya93@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Determinar el asunto y contenido del correo según el estado
    let subject = "";
    let htmlContent = "";

    switch (estado) {
      case "Postulado":
        subject = "Inicio de Proceso de Selección - Socotec Colombia";
        htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; }
                  .container { max-width: 600px; margin: auto; padding: 20px; }
                  .header { background-color: #f8f9fa; padding: 10px; text-align: center; }
                  .content { padding: 20px; }
                  .footer { text-align: center; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Socotec Colombia</h2>
                  </div>
                  <div class="content">
                    <p>Hola ${nombre},</p>
                    <p>Hemos recibido tu información para el proceso de selección para el cargo de <strong>${cargo}</strong>.</p>
                    <p>Actualmente tu aplicación está en estado: <strong>${estado}</strong>.</p>
                    <p>Te mantendremos informado sobre los próximos pasos.</p>
                    <p>Gracias por tu interés en formar parte de nuestro equipo.</p>
                  </div>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Socotec Colombia. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `;
        break;

      case "Entrevista 1" || "Entrevista 2":
        subject = "Invitación a Entrevista - Socotec Colombia";
        const citaInfo = cita
          ? `<p>Tu entrevista está programada para: <strong>${new Date(
              cita
            ).toLocaleString()}</strong>.</p>`
          : "";
        htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; }
                  .container { max-width: 600px; margin: auto; padding: 20px; }
                  .header { background-color: #f8f9fa; padding: 10px; text-align: center; }
                  .content { padding: 20px; }
                  .footer { text-align: center; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Socotec Colombia</h2>
                  </div>
                  <div class="content">
                    <p>Hola ${nombre},</p>
                    <p>Nos complace informarte que has avanzado en el proceso de selección para el cargo de <strong>${cargo}</strong>.</p>
                    <p>Tu aplicación está ahora en estado: <strong>${estado}</strong>.</p>
                    ${citaInfo}
                    ${
                      nota
                        ? `<p><strong>Nota adicional:</strong> ${nota}</p>`
                        : ""
                    }
                    <p>Por favor confirma tu asistencia respondiendo a este correo.</p>
                  </div>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Socotec Colombia. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `;
        break;

      case "Prueba Técnica":
        subject = "Pruebas Técnicas - Socotec Colombia";
        htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; }
                  .container { max-width: 600px; margin: auto; padding: 20px; }
                  .header { background-color: #f8f9fa; padding: 10px; text-align: center; }
                  .content { padding: 20px; }
                  .footer { text-align: center; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Socotec Colombia</h2>
                  </div>
                  <div class="content">
                    <p>Hola ${nombre},</p>
                    <p>Has avanzado a la etapa de <strong>Pruebas Técnicas</strong> para el cargo de <strong>${cargo}</strong>.</p>
                    ${
                      cita
                        ? `<p>La prueba está programada para: <strong>${new Date(
                            cita
                          ).toLocaleString()}</strong>.</p>`
                        : ""
                    }
                    ${
                      nota
                        ? `<p><strong>Instrucciones:</strong> ${nota}</p>`
                        : ""
                    }
                    <p>Por favor preparate para esta etapa importante del proceso.</p>
                  </div>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Socotec Colombia. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `;
        break;

      case "Contrato Firmado":
        subject = "¡Felicidades! Oferta de Contrato - Socotec Colombia";
        htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; }
                  .container { max-width: 600px; margin: auto; padding: 20px; }
                  .header { background-color: #f8f9fa; padding: 10px; text-align: center; }
                  .content { padding: 20px; }
                  .footer { text-align: center; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Socotec Colombia</h2>
                  </div>
                  <div class="content">
                    <p>¡Felicidades ${nombre}!</p>
                    <p>Nos complace informarte que has sido seleccionado para el cargo de <strong>${cargo}</strong> en Socotec Colombia.</p>
                    <p>Tipo de contrato: <strong>${tipoContrato}</strong></p>
                    <p>Salario: <strong>${salario}</strong></p>
                    ${
                      cita
                        ? `<p>Tu fecha de inicio será: <strong>${new Date(
                            cita
                          ).toLocaleString()}</strong>.</p>`
                        : ""
                    }
                    ${
                      nota
                        ? `<p><strong>Información adicional:</strong> ${nota}</p>`
                        : ""
                    }
                    <p>Por favor confirma tu aceptación respondiendo a este correo.</p>
                    <p>¡Bienvenido al equipo!</p>
                  </div>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Socotec Colombia. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `;
        break;

      case "Rechazado":
        subject = "Resultado de Proceso de Selección - Socotec Colombia";
        htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; }
                  .container { max-width: 600px; margin: auto; padding: 20px; }
                  .header { background-color: #f8f9fa; padding: 10px; text-align: center; }
                  .content { padding: 20px; }
                  .footer { text-align: center; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Socotec Colombia</h2>
                  </div>
                  <div class="content">
                    <p>Hola ${nombre},</p>
                    <p>Gracias por participar en nuestro proceso de selección para el cargo de <strong>${cargo}</strong>.</p>
                    <p>Lamentamos informarte que en esta ocasión no has sido seleccionado para continuar en el proceso.</p>
                    ${
                      nota ? `<p><strong>Comentarios:</strong> ${nota}</p>` : ""
                    }
                    <p>Te deseamos mucho éxito en tu búsqueda laboral y agradecemos tu interés en Socotec Colombia.</p>
                    <p>No descartes volver a aplicar en el futuro.</p>
                  </div>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Socotec Colombia. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `;
        break;

      default:
        subject = "Actualización de Proceso de Selección - Socotec Colombia";
        htmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; }
                  .container { max-width: 600px; margin: auto; padding: 20px; }
                  .header { background-color: #f8f9fa; padding: 10px; text-align: center; }
                  .content { padding: 20px; }
                  .footer { text-align: center; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Socotec Colombia</h2>
                  </div>
                  <div class="content">
                    <p>Hola ${nombre},</p>
                    <p>Queremos informarte sobre una actualización en tu proceso de selección para el cargo de <strong>${cargo}</strong>.</p>
                    <p>Estado actual: <strong>${estado}</strong></p>
                    ${
                      cita
                        ? `<p>Próxima cita: <strong>${new Date(
                            cita
                          ).toLocaleString()}</strong></p>`
                        : ""
                    }
                    ${nota ? `<p><strong>Nota:</strong> ${nota}</p>` : ""}
                    <p>Te mantendremos informado sobre los próximos pasos.</p>
                  </div>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Socotec Colombia. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
              </html>
            `;
    }
    // Configurar y enviar el correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Se ha actualizado con éxito y se ha enviado la notificación",
      hiring,
    });
  } catch (error) {
    console.error("Error al actualizar candidato:", error);
    res
      .status(500)
      .json({ message: "Ha ocurrido un error al actualizar candidato", error });
  }
};

exports.deleteHiring = async (req, res) => {
  try {
    const { id } = req.params;
    const hiring = await Hiring.destroy({ where: { id } });
    res.status(200).json({ message: "Se Ha Eliminado Con Exito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ha Ocurrido Un Error Al Eliminar Candidato", error });
  }
};
