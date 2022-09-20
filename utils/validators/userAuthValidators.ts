// This file holds all validators to router userAuthRouter.

export default function validateEmail(email: string): boolean {
    if(!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
        throw new Error('E-mail is not valid!')
    return true
}