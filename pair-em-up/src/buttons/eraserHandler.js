export class EraserHandler {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.maxUses = 5;
  }

  handle(cell) {
    if (!this.gameScreen.helperCounts) {
      this.gameScreen.helperCounts = {};
    }

    const currentUses = this.gameScreen.helperCounts.eraser || 0;

    if (currentUses >= this.maxUses) {
      return;
    }

    if (!cell || !cell.classList.contains('has-number')) {
      return;
    }

    if (cell.classList.contains('crossed-out')) {
      return;
    }

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (
      row < 0 ||
      row >= this.gameScreen.gameLogic.grid.length ||
      col < 0 ||
      col >= this.gameScreen.gameLogic.grid[0].length
    ) {
      return;
    }

    this.gameScreen.savePreviousState('eraser', {
      row,
      col,
      value: this.gameScreen.gameLogic.grid[row][col],
    });

    this.gameScreen.gameLogic.grid[row][col] = null;
    cell.classList.add('crossed-out');
    cell.classList.remove('has-number');

    this.gameScreen.helperCounts.eraser = currentUses + 1;
    const remaining = this.maxUses - this.gameScreen.helperCounts.eraser;
    this.gameScreen.updateHelperButton('Eraser', remaining);
    this.gameScreen.backUsed = false;
    this.gameScreen.setBackButtonDisabled(false);
  }
}
