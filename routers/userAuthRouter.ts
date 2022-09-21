import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

import { body, validationResult } from 'express-validator';

import {
    validateEmail,
    validatePassword,
    validatePasswords,
    validateNickname,
    validateSocialMediaNickname
} from '../utils/validators/userAuthValidators';


const userRouter = express.Router()
const prisma = new PrismaClient()


userRouter.get('/login', (req: Request, res: Response) => {
    res.send('This is route: login');
});


userRouter.post(
    '/register',
    // Validations
    body('email').custom(validateEmail),
    body('password1').custom(validatePassword),
    body('password2').custom((password2, {req}) => {return validatePasswords(req.body.password1, password2)}),
    body('nickname').custom(validateNickname),
    body('twitter').custom(validateSocialMediaNickname),
    body('discord').custom(validateSocialMediaNickname),
    body('instagram').custom(validateSocialMediaNickname),
    body('facebook').custom(validateSocialMediaNickname),
    async (req: Request, res: Response) => {

    const body: any = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    try {
        await prisma.user.create({
            data: {
                email: body.email,
                nickname: body.nickname,
                password: body.password1,
                coins: 0,
                twitter: body.twitter,
                facebook: body.facebook,
                discord: body.discord,
                instagram: body.instagram,
            },
        })
    } catch (err) {
        return res.status(500).json({serverError: 'Could not create user due to server error.'})
    }

    res.status(201).json({'success': 'The user was successfully created!',});
});

export default userRouter;