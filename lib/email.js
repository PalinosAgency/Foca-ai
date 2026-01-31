import nodemailer from 'nodemailer';

// Configuração do "Carteiro" (SMTP)
// Usa as variáveis de ambiente para segurança (Configuradas na Vercel)
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

/**
 * Gera o HTML estilizado com a marca Foca.aí
 * Design limpo, profissional e com as cores oficiais.
 */
const getEmailTemplate = (title, message, buttonText, buttonLink) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
      /* CORREÇÃO: Removido o typo 'RPPk' que estava aqui */
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      .header { background-color: #040949; padding: 35px 20px; text-align: center; }
      .logo { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
      .content { padding: 40px 30px; color: #333333; line-height: 1.7; }
      .h1 { color: #040949; font-size: 24px; margin-bottom: 20px; font-weight: 700; text-align: center; }
      .text { color: #555555; font-size: 16px; margin-bottom: 30px; text-align: center; }
      .button-container { text-align: center; margin: 35px 0; }
      .button { background-color: #0026f7; color: #ffffff !important; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(0, 38, 247, 0.3); transition: background-color 0.3s ease; }
      .button:hover { background-color: #001ec0; }
      .footer { background-color: #f9fafb; padding: 25px; text-align: center; font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
      .link { color: #0026f7; word-break: break-all; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">Foca.aí 🎯</div>
      </div>
      <div class="content">
        <h1 class="h1">${title}</h1>
        <p class="text">${message}</p>
        
        <div class="button-container">
          <a href="${buttonLink}" class="button" target="_blank">${buttonText}</a>
        </div>
        
        <p class="text" style="font-size: 14px; margin-top: 40px; color: #888;">
          Se o botão não funcionar, copie e cole este link no seu navegador:<br>
          <a href="${buttonLink}" class="link">${buttonLink}</a>
        </p>
      </div>
      <div class="footer">
        <p><strong>Foca.aí - Organização Pessoal Inteligente</strong><br>
        © ${new Date().getFullYear()} Todos os direitos reservados.</p>
        <p style="margin-top: 10px;">Este é um e-mail automático, por favor não responda.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Função de envio
 */
export const sendEmail = async ({ to, subject, title, message, buttonText, buttonLink }) => {
  // Verificação de Segurança
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ ERRO CRÍTICO: Variáveis de email (EMAIL_USER/PASS) não configuradas na Vercel.');
    return false;
  }

  const html = getEmailTemplate(title, message, buttonText, buttonLink);

  try {
    await transporter.sendMail({
      from: `"Equipe Foca.aí" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email enviado com sucesso para ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
};