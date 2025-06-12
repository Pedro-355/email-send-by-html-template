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