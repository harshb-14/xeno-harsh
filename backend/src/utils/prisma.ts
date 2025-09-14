import { PrismaClient } from '@prisma/client';

// Single Prisma instance for the entire application
export const prisma = new PrismaClient();