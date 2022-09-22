import dotenv from 'dotenv';
dotenv.config();


export const ENV: any = process.env.ENV;
export const SECRET_KEY: any = process.env.SECRET_KEY
export const COINS_PER_DOLLAR = 5;