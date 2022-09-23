import nodemailer from 'nodemailer';
import { NOREPLY_MAIL, NOREPLY_PASS, DOMAIN } from '../config';
import { getUserById } from './auth';

// DEFAULTS
import {resetPasswordDefaultContent, resetPasswordDefaultSubject } from './email_defaults';

const transporter = nodemailer.createTransport({
    name: DOMAIN,
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: NOREPLY_MAIL,
      pass: NOREPLY_PASS
    }
});

export function generateEmailOptions(email: string, subject: string, content: string) {
    return {
        from: NOREPLY_MAIL,
        to: email,
        subject: subject,
        html: content
    };
}

// RESET PASSWORD
export async function sendResetPasswordEmail(userId: string, otp: string){
    const user: any = await getUserById(userId)

    const emailOptions = generateEmailOptions(user.email, resetPasswordDefaultSubject, resetPasswordDefaultContent(user.nickname, otp))
    transporter.sendMail(emailOptions, function(error, info){
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent: ' + info.response)
        }
      });
}