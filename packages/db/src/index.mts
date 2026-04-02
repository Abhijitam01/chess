import { createRequire } from 'module';
import type { PrismaClient as PrismaClientClass } from './generated/client';

// Node.js v22+ ESM no longer generates named exports from CJS modules that set
// `module.exports.__esModule = true`. The Prisma generated client does this, so
// static `import { PrismaClient }` fails. Use createRequire to load it as CJS.
const _require = createRequire(import.meta.url);
const { PrismaClient } = _require('./generated/client') as { PrismaClient: typeof PrismaClientClass };

const globalForPrisma = global as unknown as { prisma: InstanceType<typeof PrismaClientClass> };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Type-only re-export so consumers get Prisma types without a runtime ESM re-export
// of the CJS generated client (which would also fail in Node.js v22+ ESM).
export type * from './generated/client';
