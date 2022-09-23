import { SECRET_KEY } from "../config";
import { authenticator } from 'otplib';

/*
 *  TOTP `type` are for maintaining different OTP for the same user depending on
 *  what he is solicitating in our platform.
 *
 *  You should use these TOTP types:
 *  -> 'pwdforgot', for password changing before login
 *  -> 'pwdreset', for password changing after login
 *  -> 'emailreset', for email changing after login
 *
 */

// TOPT expiration time (seconds)
export const TOPT_STEP = 600;


export function generateTOPT(userId: string, type: string): string {
    authenticator.options = {
        digits: 6,
        step: TOPT_STEP,
        window: 0,
    };
    const totpSecret = SECRET_KEY + userId
    return authenticator.generate(totpSecret);
}

export function verifyTOTP(token: string, userId: string, type: string): boolean {
    const totpSecret = SECRET_KEY + userId
    try { return authenticator.check(token, totpSecret)} catch (err) { return false }
}
