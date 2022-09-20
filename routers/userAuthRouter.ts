import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

import { body, validationResult } from 'express-validator';

import validateEmail from '../utils/validators/userAuthValidators';


const userRouter = express.Router()
const prisma = new PrismaClient()




userRouter.get('/login', (req: Request, res: Response) => {
    res.send('This is route: login');
});

userRouter.post(
    '/register',
    // Validations
    body('email').custom(validateEmail),
    async (req: Request, res: Response) => {
    
    const body: any = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    const user = await prisma.user.create({
        data: {
            email: body.email,
            nickname: body.nickname,
            password: body.password,
            coins: 0,
        },
    })

    res.status(201).json({'msg': 'This is route: register',});
});

export default userRouter;