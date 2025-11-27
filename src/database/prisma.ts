// Use require to avoid TypeScript errors when Prisma client wasn't generated yet
// this lets the code run but avoids importing types that may reference generated files
const { PrismaClient } = require("@prisma/client");

export const prisma = new PrismaClient({
    log: ["query"],
});