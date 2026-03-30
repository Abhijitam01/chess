import { test, expect } from '@playwright/test';

test.describe('Public Matchmaking Workflow', () => {
  test('should find opponent through public matchmaking and initialize game', async ({ page, context }) => {
    // Create second browser context for opponent
    const opponentPage = await context.newPage();

    // Navigate both players to game page
    await page.goto('/game');
    await opponentPage.goto('/game');

    // Wait for both pages to load and authenticate
    await page.waitForLoadState('networkidle');
    await opponentPage.waitForLoadState('networkidle');

    // Check that both players see the matchmaking UI
    const matchmakingButton = page.locator('button:has-text("Find Match")');
    const opponentMatchmakingButton = opponentPage.locator('button:has-text("Find Match")');

    await expect(matchmakingButton).toBeVisible();
    await expect(opponentMatchmakingButton).toBeVisible();

    // Player 1 initiates matchmaking
    await matchmakingButton.click();

    // Verify "Searching..." or "Cancel" state appears
    await expect(page.locator('text=Searching for opponent')).toBeVisible({ timeout: 5000 });

    // Player 2 initiates matchmaking
    await opponentMatchmakingButton.click();
    await expect(opponentPage.locator('text=Searching for opponent')).toBeVisible({ timeout: 5000 });

    // Wait for both players to find match and be directed to game board
    // One will be white, one will be black
    const board = page.locator('[data-testid="chess-board"]');
    const opponentBoard = opponentPage.locator('[data-testid="chess-board"]');

    await expect(board).toBeVisible({ timeout: 15000 });
    await expect(opponentBoard).toBeVisible({ timeout: 15000 });

    // Verify game initialization
    // Player 1 should see their color and opponent info
    const playerColor = page.locator('[data-testid="player-color"]');
    const opponentColor = opponentPage.locator('[data-testid="player-color"]');

    await expect(playerColor).toBeVisible();
    await expect(opponentColor).toBeVisible();

    // Verify colors are opposite
    const player1ColorText = await playerColor.textContent();
    const player2ColorText = await opponentColor.textContent();

    expect(
      (player1ColorText?.includes('White') && player2ColorText?.includes('Black')) ||
      (player1ColorText?.includes('Black') && player2ColorText?.includes('White'))
    ).toBeTruthy();

    // Verify both players see opponent username
    const opponentUsername = page.locator('[data-testid="opponent-username"]');
    const playerUsername = opponentPage.locator('[data-testid="opponent-username"]');

    await expect(opponentUsername).toBeVisible();
    await expect(playerUsername).toBeVisible();

    // Verify clock is running for current player
    const activeClock = page.locator('[data-testid="active-clock"]');
    const inactiveClock = opponentPage.locator('[data-testid="inactive-clock"]');

    await expect(activeClock).toBeVisible();
    await expect(inactiveClock).toBeVisible();

    // Player 1 makes first move if white
    const firstMove = page.locator('[data-testid="board-square"][data-square="e2"]');
    const targetSquare = page.locator('[data-testid="board-square"][data-square="e4"]');

    if (player1ColorText?.includes('White')) {
      // Player 1 is white, can move first
      await firstMove.click();
      await targetSquare.click();

      // Verify move appears on both boards
      await page.waitForTimeout(500); // Brief wait for move propagation
      
      const movedPiece = page.locator('[data-testid="board-square"][data-square="e4"][data-piece]');
      const opponentMovedPiece = opponentPage.locator('[data-testid="board-square"][data-square="e4"][data-piece]');

      await expect(movedPiece).toBeVisible();
      await expect(opponentMovedPiece).toBeVisible();

      // Verify move history is updated
      const moveHistory = page.locator('[data-testid="move-history"]');
      await expect(moveHistory).toContainText('e4');

      const opponentMoveHistory = opponentPage.locator('[data-testid="move-history"]');
      await expect(opponentMoveHistory).toContainText('e4');
    }

    // Verify clock switched to opponent after move
    const playerClockAfterMove = page.locator('[data-testid="inactive-clock"]');
    const opponentClockAfterMove = opponentPage.locator('[data-testid="active-clock"]');

    await expect(playerClockAfterMove).toBeVisible();
    await expect(opponentClockAfterMove).toBeVisible();

    // Verify game status is "In Progress"
    const gameStatus = page.locator('[data-testid="game-status"]');
    const opponentGameStatus = opponentPage.locator('[data-testid="game-status"]');

    await expect(gameStatus).toContainText('In Progress');
    await expect(opponentGameStatus).toContainText('In Progress');

    // Verify no error messages
    const errorMessage = page.locator('[data-testid="error-message"]');
    const opponentErrorMessage = opponentPage.locator('[data-testid="error-message"]');

    await expect(errorMessage).not.toBeVisible();
    await expect(opponentErrorMessage).not.toBeVisible();

    await opponentPage.close();
  });

  test('should handle matchmaking cancellation', async ({ page }) => {
    await page.goto('/game');
    await page.waitForLoadState('networkidle');

    const matchmakingButton = page.locator('button:has-text("Find Match")');
    await expect(matchmakingButton).toBeVisible();

    // Start matchmaking
    await matchmakingButton.click();
    await expect(page.locator('text=Searching for opponent')).toBeVisible();

    // Find and click cancel button
    const cancelButton = page.locator('button:has-text("Cancel")');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();

    // Verify we return to game page with matchmaking button visible
    await expect(matchmakingButton).toBeVisible();
    await expect(page.locator('text=Searching for opponent')).not.toBeVisible();
  });

  test('should display connection error if WebSocket disconnects during matchmaking', async ({ page }) => {
    await page.goto('/game');
    await page.waitForLoadState('networkidle');

    const matchmakingButton = page.locator('button:has-text("Find Match")');
    await matchmakingButton.click();

    // Simulate network error
    await page.context().setOffline(true);

    // Verify error message appears
    const errorMessage = page.locator('[data-testid="connection-error"]');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    // Restore connection
    await page.context().setOffline(false);

    // Verify reconnection UI appears
    const reconnectButton = page.locator('button:has-text("Reconnect")');
    await expect(reconnectButton).toBeVisible({ timeout: 5000 });
  });
});
