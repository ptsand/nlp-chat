import nodemailer from "nodemailer";
import { smtp_conf } from "../config/smtp_config.js";

let _transporter;

// lazy load transporter
const transporter = ()=>{
    if (_transporter) {
        return _transporter;
    } else {
        _transporter = nodemailer.createTransport(smtp_conf);
        return _transporter;
    }
};
// TODO: do it more generic
export const sendConfirmationMail = (to, code)=>{
    const mail = {
        from: "authbot@localhost",
        to,
        subject: "email confirmation code",
        text: `Thank you for signing up. Please confirm you email by visiting: 
                http://localhost:5173/profile/confirm-email/${code}`,
    };
    return transporter().sendMail(mail);
};