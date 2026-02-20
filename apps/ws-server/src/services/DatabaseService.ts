import { prisma } from "@repo/db";
import { isWhiteSpaceLike } from "typescript";

export class DatabaseService {
  async createUser(username : string , email : string, password : string) {
    return prisma.user.create({
      data: {
        username,
        email,
        password,
        rating: 1000,
      },
    });
  }

  async createGuestUser(userId: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
        return existingUser;
    }

    return prisma.user.create({
      data: {
        id: userId,
        username: `Guest_${userId}`,
        email: `${userId}@guest.com`,
        password: "guest_password", // In a real app, this should be handled more securely or allow null
        rating: 1000,
      },
    });
  }

  async getUserByUsername(username : string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async updateUserRating(userId : string, newRating : number) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        rating :newRating
      },
    });
  }

  async createGame(
    whitePlayerId : string,
    blackPlayerId : string,
    whiteRating : number ,
    blackRating : number

  ){
    return await prisma.game.create({
        data: {
            whitePlayerId,
            blackPlayerId,
            whiteRatingChange : 0,
            blackRatingChange : 0,
            startedAt : new Date(),
        }
    })
  }
  async saveMove(
    gameId : string,
    moveNumber : number,
    moveSan : string,
    fen : string,
    whiteTime : number,
    blackTime : number
  ){
    return await prisma.gameMove.create({
      data: {
        gameId,
        moveNumber,
        moveSan,
        fen,
        timeLeftWhite : whiteTime,
        timeLeftBlack : blackTime,
      },
    });
  }
  async updateGame(
    gameId : string,
    winner : string,
    reason : string,
    pgn : string,
    whiteRatingChange : number,
    blackRatingChange : number
  ){
    return await prisma.game.update({
      where: { id: gameId },
      data: { winner, resultReason: reason, pgn, whiteRatingChange, blackRatingChange, finishedAt: new Date() },
    });
  }

  async getUserGames(userId: string , limit = 10){
    return await prisma.game.findMany({
        where: {
            OR: [
                { whitePlayerId: userId },
                { blackPlayerId: userId },
            ],
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
        include: {
            whitePlayer: true,
            blackPlayer: true,
        },
    })
  }
  async getGameMoves(gameId: string){
    return await prisma.gameMove.findMany({
      where: {
        gameId,
      },
      orderBy: {
        moveNumber: 'asc',
      },
    });
  }
}