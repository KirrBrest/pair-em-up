export class SaveHandler {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
  }

  handle() {
    const crossedOutCells = [];
    const gridCells = document.querySelectorAll('.grid-cell.crossed-out');
    gridCells.forEach((cell) => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const value = cell.textContent.trim();
      if (!isNaN(row) && !isNaN(col) && row >= 0 && col >= 0 && value && value !== '') {
        crossedOutCells.push({ row, col, value: parseInt(value) || value });
      }
    });

    const gameState = {
      mode: this.gameScreen.mode,
      options: this.gameScreen.options,
      grid: this.gameScreen.gameLogic.grid,
      score: this.gameScreen.gameLogic.score,
      elapsedTime: this.gameScreen.gameLogic.elapsedTime,
      startTime: this.gameScreen.gameLogic.startTime
        ? Date.now() - this.gameScreen.gameLogic.elapsedTime
        : null,
      helperCounts: this.gameScreen.helperCounts || {},
      crossedOutCells: crossedOutCells,
      playToEnd: this.gameScreen.playToEnd || false,
    };

    localStorage.setItem('pairEmUpGame', JSON.stringify(gameState));
  }
}
