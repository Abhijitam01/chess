function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Environment variable ${key} is required`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  get jwtSecret() {
    return requireEnv('JWT_SECRET');
  },
  jwtExpiresIn: '7d' as const,
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  bcryptRounds: 12,
};
