import nodemailer, { Transporter } from "nodemailer";
import { config } from "../config";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

const transport: Transporter = nodemailer.createTransport({
  host: config.transportHost,
  port: config.transportPort,
  auth: {
    user: config.transportAuthUser,
    pass: config.transportAuthPass,
  },
});

export const sendEmail = (to: string, subject: string, text: string) => {
  const mailOptions: EmailOptions = {
    to,
    subject,
    text,
  };

  transport.sendMail({ 
    from: config.mailOptionFrom, 
    ...mailOptions 
  }, (error, info) => {
      if (error) {
        console.error('-------------------Email sending failed:-------------------', error);
      } else {
        console.log('-------------------Email sent:-------------------', info.response);
      }
    }
  );
};
