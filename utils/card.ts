import { COINS_PER_DOLLAR } from '../config'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

import uuidToHex from 'uuid-to-hex';

const prisma = new PrismaClient();

export async function generateCard(value: number): Promise<object> {
    const code: string = uuidToHex(uuidv4());
    const coins: number = value * COINS_PER_DOLLAR
    const card: any = await prisma.card.create({
        data: {code: code, coins: coins,}
    });
    return card
}