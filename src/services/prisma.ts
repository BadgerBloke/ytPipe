import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;
