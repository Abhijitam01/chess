"use client";
import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { INIT_GAME, MOVE, GAME_OVER } from '@repo/common';

type GameStatus = 'waiting' | 'playing' | 'finished';
type PlayerColor = 'white' | 'black' | null;

interface GameState {
    chess: Chess;
    playerColor: PlayerColor;
    status: GameStatus;
    turn: 'w' | 'b';
    winner: string | null;
}

export function useChessGame(socket: WebSocket | null, isConnected: boolean) {
    const [gameState, setGameState] = useState<GameState>({
        chess: new Chess(),
        playerColor: null,
        status: 'waiting',
        turn: 'w',
        winner: null,
    });

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            console.log('Game message received:', message);

            switch (message.type) {
                case INIT_GAME:
                    setGameState(prev => ({
                        ...prev,
                        playerColor: message.payload.color,
                        status: 'playing',
                    }));
                    break;

                case MOVE:
                    setGameState(prev => {
                        const newChess = new Chess(prev.chess.fen());
                        try {
                            newChess.move(message.payload);
                            return {
                                ...prev,
                                chess: newChess,
                                turn: newChess.turn(),
                            };
                        } catch (error) {
                            console.error('Invalid move received:', error);
                            return prev;
                        }
                    });
                    break;

                case GAME_OVER:
                    setGameState(prev => ({
                        ...prev,
                        status: 'finished',
                        winner: message.payload.winner,
                    }));
                    break;
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket]);

    const makeMove = (from: string, to: string) => {
        const move = gameState.chess.move({ from, to, promotion: 'q' });
        
        if (move) {
            setGameState(prev => ({
                ...prev,
                turn: prev.chess.turn(),
            }));

            if (socket && isConnected) {
                socket.send(JSON.stringify({
                    type: MOVE,
                    move: { from, to },
                }));
                console.log('Move sent to server:', { from, to });
            }
            
            return true;
        }
        
        return false;
    };

    const resetGame = () => {
        setGameState({
            chess: new Chess(),
            playerColor: null,
            status: 'waiting',
            turn: 'w',
            winner: null,
        });
    };

    return {
        ...gameState,
        makeMove,
        resetGame,
        isMyTurn: gameState.playerColor !== null && 
                  ((gameState.playerColor === 'white' && gameState.turn === 'w') ||
                   (gameState.playerColor === 'black' && gameState.turn === 'b')),
    };
}
