import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export async function POST({ request }) {
  try {
    // Verificar que las credenciales de email estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Credenciales de email no configuradas. Por favor configura EMAIL_USER y EMAIL_PASS en el archivo .env' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const formData = await request.formData();
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      attendance: formData.get('attendance'),
      guests: formData.get('guests'),
      message: formData.get('message')
    };
    
    // Configurar el transportador de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // o tu proveedor de correo
      auth: {
        user: process.env.EMAIL_USER, // tu email
        pass: process.env.EMAIL_PASS  // tu contraseña de aplicación
      }
    });

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ger.adrogue@gmail.com',
      subject: 'Nueva confirmación de asistencia - Boda Lucía & Martín',
      html: `
        <h2>Nueva confirmación de asistencia</h2>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone}</p>
        <p><strong>Asistencia:</strong> ${data.attendance === 'yes' ? 'Sí, asistiré' : 'No podré asistir'}</p>
        ${data.guests ? `<p><strong>Número de invitados:</strong> ${data.guests}</p>` : ''}
        ${data.message ? `<p><strong>Mensaje:</strong> ${data.message}</p>` : ''}
      `
    };

    // Enviar el email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: 'Email enviado correctamente' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    return new Response(JSON.stringify({ success: false, message: 'Error al enviar el email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}