// Express
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// Prisma
import { PrismaClient } from '@prisma/client';

// Validators
import { authenticatedOnlyMiddleware } from '../middlewares/authenticationMiddleware';
import { isCardCodeValid, redeemCard } from '../utils/card';

const userRouter = express.Router()
const prisma = new PrismaClient()

userRouter.post(
    '/redeem',
    // Field Validations,
    body('code').isAlphanumeric(),
    // Middlewares
    authenticatedOnlyMiddleware,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        const [isValid, errorMsg]: any = await isCardCodeValid(req.body.code)
        if(!isValid){
            res.status(401).json({msg: errorMsg});
        } else {
            const cardCoins: any = await redeemCard(req.body.code, req.body.authenticatedId)
            return res.status(201).json({msg: 'Card redeemed succesfully!', value: cardCoins.toString()});
        }
});

export default userRouter;