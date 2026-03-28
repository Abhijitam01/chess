/**
 * Smoke test for DatabaseService.
 * Run with: pnpm --filter @chess/ws-server exec tsx src/test-db.ts
 * Requires DATABASE_URL and DIRECT_URL env vars to be set.
 */
import { DatabaseService } from './services/DatabaseService';

async function testDatabase() {
  const db = new DatabaseService();

  console.log('Creating test game (guest vs guest)...');
  const game = await db.createGame(null, null, 1200, 1200);
  console.log('Game created:', game.id);

  console.log('\nSaving test moves...');
  await db.saveMove(game.id, 1, 'e4', 'e2e4', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', 300000, 300000);
  await db.saveMove(game.id, 2, 'e5', 'e7e5', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2', 300000, 298000);
  console.log('Moves saved.');

  console.log('\nUpdating game result...');
  await db.updateGame(game.id, 'white', 'checkmate', '1. e4 e5', 15, -15);
  console.log('Game result saved.');

  console.log('\nFetching game moves...');
  const moves = await db.getGameMoves(game.id);
  console.log(`Fetched ${moves.length} moves.`);

  console.log('\nSmoke test passed!');
  process.exit(0);
}

testDatabase().catch((err) => {
  console.error('Smoke test FAILED:', err);
  process.exit(1);
});
