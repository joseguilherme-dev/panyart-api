// Express
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// Prisma
import { PrismaClient } from '@prisma/client';

// Utils
import {
    changePassword,
    generateEncryptedPassword,
    getUserIdByEmail,
    isUserPasswordCorrect
} from '../utils/auth';
import { generateJWT } from '../utils/jwt';

// Validators
import {
    validateSignUpEmail,
    validateSignUpPassword,
    validateSignUpPasswords,
    validateSignUpNickname,
    validateSignUpSocialMediaNickname,
    validateLoginEmail,
    validateLoginPassword
} from '../utils/validators/userAuthValidators';

// Config
import { ENV } from '../config';
import { authenticatedOnlyMiddleware } from '../middlewares/authenticationMiddleware';
import { generateTOPT, verifyTOTP} from '../utils/otp';

const userRouter = express.Router()
const prisma = new PrismaClient()

userRouter.post(
    '/register',
    // Field Validations
    body('email').custom(validateSignUpEmail),
    body('password1').custom(validateSignUpPassword),
    body('password2').custom((password2, {req}) => {return validateSignUpPasswords(req.body.password1, password2)}),
    body('nickname').custom(validateSignUpNickname),
    body('twitter').custom(validateSignUpSocialMediaNickname),
    body('discord').custom(validateSignUpSocialMediaNickname),
    body('instagram').custom(validateSignUpSocialMediaNickname),
    body('facebook').custom(validateSignUpSocialMediaNickname),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        const password: any = await generateEncryptedPassword(req.body.password1)

        try {
            await prisma.user.create({
                data: {
                    email: req.body.email,
                    nickname: req.body.nickname,
                    password: password,
                    coins: 0,
                    twitter: req.body.twitter,
                    facebook: req.body.facebook,
                    discord: req.body.discord,
                    instagram: req.body.instagram,
                },
            })
        } catch (err) {
            return res.status(500).json({serverError: 'Could not create user due to server error.'})
        }
    res.status(201).json({'success': 'The user was successfully created!',});
});

userRouter.post(
    '/login',
    // Field Validations
    body('email').custom(validateLoginEmail),
    body('password').custom(validateLoginPassword),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        const isCorrect: any = await isUserPasswordCorrect(req.body.password, req.body.email)
        if (!isCorrect) return res.status(401).json({message: "Incorrect password!"})

        const userId = await getUserIdByEmail(req.body.email)
        const jwt: any = generateJWT(userId)

        return res.cookie("jwt", jwt, {httpOnly: true, secure: (ENV === "PRODUCTION"),})
                  .status(200).json({success: 'The user has successfully logged in!', jwt: jwt});
});

userRouter.get(
    '/logout',
    authenticatedOnlyMiddleware,
    async (req: Request, res: Response) => {
        return res.clearCookie("jwt").status(200).json({success: 'The user has successfully logged out!'});
});

userRouter.get(
    '/password/reset',
    authenticatedOnlyMiddleware,
    async (req: Request, res: Response) => {
        const otp: string = generateTOPT(req.body.authenticatedId, 'pwdreset')
        return res.status(200).json({otp: otp});
});

userRouter.get(
    '/password/reset/verify',
    // Field Validators,
    body('token').isAlphanumeric(),
    authenticatedOnlyMiddleware,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        return res.status(200).json({isOtpValid: verifyTOTP(req.body.token, req.body.authenticatedId, 'pwdreset')});
});

userRouter.post(
    '/password/reset',
    // Field Validators,
    body('token').isAlphanumeric(),
    body('password1').custom(validateSignUpPassword),
    body('password2').custom((password2, {req}) => {return validateSignUpPasswords(req.body.password1, password2)}),
    authenticatedOnlyMiddleware,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        const isOTPValid: boolean = verifyTOTP(req.body.token, req.body.authenticatedId, 'pwdreset')
        if (!isOTPValid)
            return res.status(401).json({msg: "Token is invalid or has expired."});

        await changePassword(req.body.password1, req.body.authenticatedId)
        return res.clearCookie("jwt").status(200).json({msg: "Password was succesfully reseted! Please, login again."});
});



export default userRouter;