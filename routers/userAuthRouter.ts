// Express
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// Middlewares
import { authenticatedOnlyMiddleware } from '../middlewares/authenticationMiddleware';

// Prisma
import { PrismaClient } from '@prisma/client';

// Utils
import {
    changePassword,
    generateEncryptedPassword,
    getUserById,
    getUserIdByEmail,
    isUserPasswordCorrect,
    updatePersonalInformation
} from '../utils/auth';
import { generateJWT } from '../utils/jwt';
import { generateTOPT, verifyTOTP} from '../utils/otp';
import { sendResetPasswordEmail } from '../utils/email';

// Validators
import {
    validateSignUpEmail,
    validateSignUpPassword,
    validateSignUpPasswords,
    validateSignUpNickname,
    validateSignUpSocialMediaNickname,
    validateLoginEmail,
    validateLoginPassword,
    validatePasswordForgotEmail,
    validateEmptyField
} from '../utils/validators/userAuthValidators';

// Config
import { ENV } from '../config';


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
        sendResetPasswordEmail(req.body.authenticatedId, otp)
        return res.status(200).json({msg: "OTP sent to account owner's email."});
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

userRouter.get(
    '/password/forgot',
    // Field Validators,
    body('email').custom(validatePasswordForgotEmail),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        const userId: any = await getUserIdByEmail(req.body.email) 
        const otp: string = generateTOPT(userId, 'pwdforgot')
        sendResetPasswordEmail(userId, otp)
        return res.status(200).json({msg: "OTP sent to account owner's email."});
});

userRouter.get(
    '/password/forgot/verify',
    // Field Validators,
    body('token').isAlphanumeric(),
    body('email').custom(validatePasswordForgotEmail),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        const userId: any = await getUserIdByEmail(req.body.email)
        return res.status(200).json({isOtpValid: verifyTOTP(req.body.token, userId, 'pwdforgot')});
});

userRouter.post(
    '/password/forgot',
    // Field Validators,
    body('token').isAlphanumeric(),
    body('email').custom(validatePasswordForgotEmail),
    body('password1').custom(validateSignUpPassword),
    body('password2').custom((password2, {req}) => {return validateSignUpPasswords(req.body.password1, password2)}),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        const userId: any = await getUserIdByEmail(req.body.email)

        const isOTPValid: boolean = verifyTOTP(req.body.token, userId, 'pwdforgot')

        if (!isOTPValid)
            return res.status(401).json({msg: "Token is invalid or has expired."});

        await changePassword(req.body.password1, userId)
        return res.clearCookie("jwt").status(200).json({msg: "Password was succesfully reseted! Please, login again."});
});

userRouter.patch(
    '/personal',
    // Field Validations
    body('nickname').custom(validateSignUpNickname),
    body('twitter').custom(validateSignUpSocialMediaNickname),
    body('discord').custom(validateSignUpSocialMediaNickname),
    body('instagram').custom(validateSignUpSocialMediaNickname),
    body('facebook').custom(validateSignUpSocialMediaNickname),
    authenticatedOnlyMiddleware,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        await updatePersonalInformation(req.body, req.body.authenticatedId)
    res.status(201).json({'success': 'The user was updated succesfully!',});
});

userRouter.get(
    '/personal',
    authenticatedOnlyMiddleware,
    async (req: Request, res: Response) => {
    const user: any = await getUserById(req.body.authenticatedId)
    res.status(201).json({
        'personal': {
            'nickname': user.nickname || '',
            'twitter': user.twitter || '',
            'discord': user.discord || '',
            'instagram': user.instagram || '',
            'facebook': user.facebook || '',
        },
    });
});

export default userRouter;