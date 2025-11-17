export class ContinueHandler {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
  }

  handle() {
    const savedGame = localStorage.getItem('pairEmUpGame');
    if (!savedGame) {
      return;
    }

    const gameState = JSON.parse(savedGame);
    this.gameScreen.gameLogic.grid = gameState.grid;
    this.gameScreen.gameLogic.score = gameState.score || 0;
    this.gameScreen.gameLogic.elapsedTime = gameState.elapsedTime || 0;

    if (gameState.startTime) {
      this.gameScreen.gameLogic.startTime = Date.now() - this.gameScreen.gameLogic.elapsedTime;
    }

    if (gameState.helperCounts) {
      this.gameScreen.helperCounts = gameState.helperCounts;
    }

    const savedPreviousState = localStorage.getItem('pairEmUpPreviousState');
    if (savedPreviousState) {
      try {
        this.gameScreen.previousState = JSON.parse(savedPreviousState);
        this.gameScreen.backUsed = false;
      } catch {
        this.gameScreen.previousState = null;
        this.gameScreen.backUsed = true;
      }
    } else {
      this.gameScreen.previousState = null;
      this.gameScreen.backUsed = true;
    }

    this.gameScreen.selectedCells = [];
    this.gameScreen.clearSelection();
    this.gameScreen.eraserMode = false;
    this.gameScreen.recreateGrid(gameState.crossedOutCells || []);
    this.gameScreen.updateScore();
    this.gameScreen.updateTimer();
    this.gameScreen.updateAllHelperButtons();
  }
}
