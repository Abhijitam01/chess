import { createRequire } from 'module';
// Node.js v22+ ESM no longer generates named exports from CJS modules that set
// `module.exports.__esModule = true`. The Prisma generated client does this, so
// static `import { PrismaClient }` fails. Use createRequire to load it as CJS.
const _require = createRequire(import.meta.url);
const { PrismaClient } = _require('./generated/client');
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
