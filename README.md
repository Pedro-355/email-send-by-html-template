# email-send-by-html-template

### .env
 crie um arquivo .env para colocar seu email e senha
 ```yaml
 EMAIL_USER=exemple@exemple.com
 EMAIL_PASS=password
```
### email-list.yaml
 aqui é o arquivo onde deve ser colocado o nome e email de cada pessoa que você deseja enviar
 ```yaml
 - name: fulano
   email: fulano@exemple.com
 ```
### email-template.html
 aqui pode ser colado qualquer template html de email para enviar

## setup
```bash
npm init -y
npm install nodemailer yaml fs-extra dotenv
npm install --save-dev typescript @types/node ts-node
npx tsc --init
npm install --save-dev @types/fs-extra @types/nodemailer
```
## run
```bash
npx ts-node send-emails.ts
```


# está configurado para emails de altra prioridade, caso não seja essa função deve ser alterada 
```ts
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
```

## caso não seja via outlook essa função tambem deve ser alterada para os padroes do gmail