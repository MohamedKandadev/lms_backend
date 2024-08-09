import asyncHandler from 'express-async-handler';
import nodeMailer from 'nodemailer';
import ejs from 'ejs';

import path from 'path';
import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

interface IEmailOptions {
  email: string;
  subject: string;
  template: string;
  data: {[key: string]: any}
}
const sendMail = (async (options: IEmailOptions):Promise <void> => {
  const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  const {email, subject, template, data} = options;
  const templatePath = path.join(__dirname, '../views', template);
  const html: string = await  ejs.renderFile(templatePath, data)
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: subject,
    html
  };
  await transporter.sendMail(mailOptions);
})

export default sendMail;