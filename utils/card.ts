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

export async function isCardCodeValid(code: string){
    const card: any = await prisma.card.findFirst({where: {code: code}})
    if(!card)
        return [false, "Inserted code does not exist!"]
    if(card.redeemed)
        return [false, "Inserted code has already been redeemed!"]
    return [card, true]
}

export async function redeemCard(code: string, userId: string){
    const card: any = await prisma.card.findFirst({where: {code: code}})
    const user: any = await prisma.user.findFirst({where: {id: userId}, select: {coins: true},})
    const newCoinsValue = card.coins + user.coins
    await prisma.card.update({where: {code: card.code}, data: {redeemed: true, redeemedBy: userId, redeemedAt: new Date()}})
    await prisma.user.update({where: {id: userId}, data: {coins: newCoinsValue}})
    return card.coins
}
