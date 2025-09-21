import { config } from 'dotenv';
config();
import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST
const port = process.env.SMTP_PORT
const secure = process.env.SMTP_SECURE
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const emailFrom = process.env.EMAIL_FROM

if (!user || !pass) {
    throw new Error('Missing SMTP_USER/SMTP_PASS envs');
}

console.log("mmmmm asaiii")

export const mailer = nodemailer.createTransport({
    host: host,
    port: Number(port || 465),
    secure: String(secure || 'true') === 'true',
    auth: { user: user, pass: pass }
});

export const FROM = emailFrom || '"School Staff Portal" <no-reply@example.com>';