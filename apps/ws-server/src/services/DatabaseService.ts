import { prisma } from "@repo/db";

export class DatabaseService {
  // ── Auth ────────────────────────────────────────────────────────────────────

  async createProfileWithCredentials(username: string, passwordHash: string) {
    return prisma.$transaction(async (tx) => {
      const profile = await tx.profile.create({ data: { username } });
      await tx.credentials.create({ data: { profileId: profile.id, passwordHash } });
      return profile;
    });
  }

  async findProfileWithCredentials(username: string) {
    return prisma.profile.findUnique({
      where: { username },
      include: { credentials: true },
    });
  }

  // ── Profile ─────────────────────────────────────────────────────────────────

  async getProfileByUsername(username: string) {
    return prisma.profile.findUnique({ where: { username } });
  }

  async getProfileById(userId: string) {
    return prisma.profile.findUnique({ where: { id: userId } });
  }

  async updateProfileStats(
    userId: string,
    ratingDelta: number,
    outcome: 'win' | 'loss' | 'draw',
  ) {
    return prisma.profile.update({
      where: { id: userId },
      data: {
        rating: { increment: ratingDelta },
        totalGames: { increment: 1 },
        wins:   outcome === 'win'  ? { increment: 1 } : undefined,
        losses: outcome === 'loss' ? { increment: 1 } : undefined,
        draws:  outcome === 'draw' ? { increment: 1 } : undefined,
      },
    });
  }

  async createGame(
    whitePlayerId: string | null,
    blackPlayerId: string | null,
    whiteRating: number,
    blackRating: number,
  ) {
    return await prisma.game.create({
      data: {
        whitePlayerId,
        blackPlayerId,
        initialWhiteRating: whiteRating,
        initialBlackRating: blackRating,
        whiteRatingChange: 0,
        blackRatingChange: 0,
        startedAt: new Date(),
      },
    });
  }

  async saveMove(
    gameId: string,
    moveNumber: number,
    moveSan: string,
    moveUci: string,
    fen: string,
    whiteTime: number,
    blackTime: number,
  ) {
    return await prisma.gameMove.create({
      data: {
        gameId,
        moveNumber,
        moveSan,
        moveUci,
        fen,
        timeLeftWhite: whiteTime,
        timeLeftBlack: blackTime,
      },
    });
  }

  async updateGame(
    gameId: string,
    winner: string,
    reason: string,
    pgn: string,
    whiteRatingChange: number,
    blackRatingChange: number,
  ) {
    return await prisma.game.update({
      where: { id: gameId },
      data: { winner, resultReason: reason, pgn, whiteRatingChange, blackRatingChange, finishedAt: new Date() },
    });
  }

  async getUserGames(userId: string, limit = 10) {
    return await prisma.game.findMany({
      where: {
        OR: [
          { whitePlayerId: userId },
          { blackPlayerId: userId },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        whitePlayer: true,
        blackPlayer: true,
      },
    });
  }

  async getGameMoves(gameId: string) {
    return await prisma.gameMove.findMany({
      where: { gameId },
      orderBy: { moveNumber: "asc" },
    });
  }

  async getLeaderboard(limit = 50) {
    return await prisma.profile.findMany({
      orderBy: { rating: "desc" },
      take: limit,
      select: {
        id: true,
        username: true,
        rating: true,
        wins: true,
        losses: true,
        draws: true,
        totalGames: true,
      },
    });
  }

  async getProfileStats(username: string) {
    const profile = await prisma.profile.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        rating: true,
        wins: true,
        losses: true,
        draws: true,
        totalGames: true,
      },
    });
    return profile;
  }
}
