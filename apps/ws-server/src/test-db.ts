import { DatabaseService } from './services/DatabaseService';

async function testDatabase() {
  const db = new DatabaseService();

  console.log('Creating test users...');
  
  let alice = await db.getUserByUsername('alice');
  if (!alice) {
    alice = await db.createUser('alice', 'alice@chess.com', 'password');
  }

  let bob = await db.getUserByUsername('bob');
  if (!bob) {
    bob = await db.createUser('bob', 'bob@chess.com', 'password123');
  }

  console.log('Alice:', alice);
  console.log('Bob:', bob);

  console.log('\nFetching alice by username...');
  const foundAlice = await db.getUserByUsername('alice');
  console.log(foundAlice);

  console.log('\nTest complete!');
  process.exit(0);
}

testDatabase().catch(console.error);