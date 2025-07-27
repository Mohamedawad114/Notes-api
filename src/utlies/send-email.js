import nodemailer from "nodemailer";
import { EventEmitter } from "node:events";

async function SendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_GMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const Info = await transporter.sendMail({
      from: process.env.APP_GMAIL,
      to: to,
      subject: subject,
      html: html,
    });
    console.log(Info.response);
  } catch (err) {
    console.log(err);
  }
}

export const emittir = new EventEmitter();

emittir.on("sendemail", (args) => {
  SendEmail(args);
});

export default SendEmail;
