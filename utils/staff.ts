
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function isUserStaff (userId: string) {
    const userObj: any = await prisma.user.findFirst({where: {id: userId}, select: {id: true, email: true, isStaff: true,}})
    return userObj.isStaff
}