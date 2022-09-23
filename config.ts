import dotenv from 'dotenv';
dotenv.config();


// Email
export const DOMAIN: any = process.env.DOMAIN;
export const NOREPLY_MAIL: any = process.env.NOREPLY_MAIL;
export const NOREPLY_PASS: any = process.env.NOREPLY_PASS;

export const ENV: any = process.env.ENV;
export const SECRET_KEY: any = process.env.SECRET_KEY
export const COINS_PER_DOLLAR = 5;