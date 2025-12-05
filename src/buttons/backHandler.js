export class BackHandler {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
  }

  handle() {
    if (this.gameScreen.backUsed) {
      return;
    }

    const previousState = this.gameScreen.previousState;
    if (!previousState) {
      return;
    }

    this.gameScreen.gameLogic.grid = JSON.parse(JSON.stringify(previousState.grid));
    this.gameScreen.gameLogic.score = previousState.score;

    if (previousState.actionType === 'eraser' && previousState.actionData) {
      const { row, col, value } = previousState.actionData;
      this.gameScreen.gameLogic.grid[row][col] = value;
    } else {
      this.gameScreen.helperCounts = { ...previousState.helperCounts };
    }

    this.gameScreen.previousState = null;

    this.gameScreen.selectedCells = [];
    this.gameScreen.clearSelection();
    this.gameScreen.eraserMode = false;
    this.gameScreen.recreateGrid(previousState.crossedOutCells || []);
    this.gameScreen.updateScore();
    this.gameScreen.updateAllHelperButtons();
    this.gameScreen.setBackButtonDisabled(true);
    this.gameScreen.backUsed = true;

    localStorage.removeItem('pairEmUpPreviousState');
  }
}
