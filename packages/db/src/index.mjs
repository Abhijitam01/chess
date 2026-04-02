import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
const mod = _require('./index.js');
export const prisma = mod.prisma;
export const PrismaClient = mod.PrismaClient;
export const Prisma = mod.Prisma;
export const $Enums = mod.$Enums;
