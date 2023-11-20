import nodemailer, { Transporter } from "nodemailer";
import { config } from "../config";
import { IUser, TokenAction, TokenActions } from "../models";
import { logger } from "../helpers/logger";

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




export const sendEmail = async (to: string, userId: IUser['_id'], verificationToken: string) => {

  const subject = "Confirm Email";
  const text = `go to link http://localhost:3000/api/verify-email/${verificationToken}`

  const mailOptions: EmailOptions = {
    to,
    subject,
    text,
  };

  const actionName: TokenActions = "emailVerification"

  const tokenAction = new TokenAction({
    token: verificationToken,
    actionName,
    createdBy: userId,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });  

  await tokenAction.save();

  transport.sendMail({ 
    from: config.mailOptionFrom, 
    ...mailOptions 
  }, (error, info) => {
      if (error) {
        logger.error(`-------------------Email sending failed:------------------- ${error}`);
      } else {
        logger.info(`-------------------Email sent:------------------- ${info.response}`);
      }
    }
  );
};
