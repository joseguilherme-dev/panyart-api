// Express
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// Prisma
import { PrismaClient } from '@prisma/client';

// Utils
import {
    generateEncryptedPassword,
    getUserIdByEmail,
    isUserPasswordCorrect
} from '../utils/auth';
import { generateJWT } from '../utils/jwt';

// Validators

// Config
import { ENV } from '../config';
import { authenticatedOnlyMiddleware } from '../middlewares/authenticationMiddleware';
import { staffOnlyMiddleware } from '../middlewares/staffMiddleware';
import { generateCard } from '../utils/card';
import { validateCardValue } from '../utils/validators/adminValidators';


const adminRouter = express.Router()
const prisma = new PrismaClient()


adminRouter.post(
    '/card',
    // Field Validations,
    body('value').custom(validateCardValue),
    // Middlewares
    authenticatedOnlyMiddleware,
    staffOnlyMiddleware,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
        const card: any = await generateCard(req.body.value)
        return res.status(201).json({msg: 'Card successfully created!', card: {
            code: card.code,
            createdAt: card.createdAt,
            coins: card.coins.toString()
        }});
});

export default adminRouter;