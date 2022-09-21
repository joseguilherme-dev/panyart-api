// This file holds all validators to router userAuthRouter.
import { PrismaClient } from "@prisma/client"
import { doesNotExist, isString } from "./general";

const prisma = new PrismaClient();


// Login Validators
export function validateLoginPassword(password: string): boolean {
    if (doesNotExist(password))
        throw new Error('Password was not inserted!')
    if (!isString(password))
        throw new Error('Password is not a string!')
    return true
}

export async function validateLoginEmail(email: string): Promise<boolean> {
    if (doesNotExist(email))
        throw new Error('E-mail was not inserted!')
    if (!isString(email))
        throw new Error('E-mail is not a string!')
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
        throw new Error('E-mail is not valid!')
    return true
}

// Sign Up Validators
export async function validateSignUpEmail(email: string): Promise<boolean> {
    if (doesNotExist(email))
        throw new Error('E-mail was not inserted!')
    if (!isString(email))
        throw new Error('E-mail is not a string!')
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
        throw new Error('E-mail is not valid!')
    const emailExists = await prisma.user.count({where: {email: email}})
    if (emailExists > 0)
        throw new Error('Email already registered!')

    return true
}

export function validateSignUpPassword(password: string): boolean {
    if (doesNotExist(password))
        throw new Error('Password was not inserted!')
    if (!isString(password))
        throw new Error('Password is not a string!')
    // Passwords should follow the pattern: minimum eight characters, at least one letter and one number.
    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
        throw new Error('Password is not valid!')
    return true
}
export function validateSignUpPasswords(password1: string, password2: string,): boolean {
    if (!isString(password2))
        throw new Error('Password confirmation is not a string!')
    if (doesNotExist(password2))
        throw new Error('Password confirmation was not inserted!')
    if (password1 !== password2)
        throw new Error('Passwords does not match!')
    return true
}

export function validateSignUpNickname(nickname: string): boolean {
    if (!isString(nickname))
        throw new Error('Nickname is not a string!')
    if (doesNotExist(nickname))
        throw new Error('Nickname was not inserted!')
    // Nicknames should follow the pattern:
    // minimum three characters, maximum sixteen characters and can not contain spaces.
    // It can also contains '-' and '_'.
    if (!nickname.match(/^[A-Za-z0-9_-]{3,16}$/))
        throw new Error('Nickname is not valid!')
    return true
}

export function validateSignUpSocialMediaNickname(socialMedia: string): boolean {
    if (!doesNotExist(socialMedia))
        if (!isString(socialMedia))
            throw new Error('Nickname is not a string!')
    return true
}
