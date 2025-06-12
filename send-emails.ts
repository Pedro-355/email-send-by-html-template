import fs from 'fs-extra';
import path from 'path';
import nodemailer from 'nodemailer';
import yaml from 'yaml';
import dotenv from 'dotenv';

dotenv.config();

interface Recipient {
  name: string;
  email: string;
}

async function loadRecipients(): Promise<Recipient[]> {
  const jsonPath = path.resolve(__dirname, 'email-list.json');
  const yamlPath = path.resolve(__dirname, 'email-list.yaml');

  if (await fs.pathExists(jsonPath)) {
    return await fs.readJSON(jsonPath);
  } else if (await fs.pathExists(yamlPath)) {
    const yamlContent = await fs.readFile(yamlPath, 'utf8');
    return yaml.parse(yamlContent);
  } else {
    throw new Error('Arquivo de destinatários não encontrado (email-list.json ou email-list.yaml)');
  }
}

async function loadTemplate(): Promise<string> {
  const templatePath = path.resolve(__dirname, 'email-template.html');
  return await fs.readFile(templatePath, 'utf8');
}

async function sendEmails() {
    const recipients = await loadRecipients();
    const htmlTemplate = await loadTemplate();
  
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
  
    for (const recipient of recipients) {
      const htmlContent = htmlTemplate.replace('{{name}}', recipient.name);
  
      const mailOptions = {
        from: `"Seu Nome" <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject: 'Politica de acessos',
        html: htmlContent,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'High'
        }
      };
  
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado para ${recipient.email}: ${info.response}`);
      } catch (error) {
        console.error(`Erro ao enviar para ${recipient.email}:`, error);
      }
    }
  }

sendEmails().catch(console.error);
