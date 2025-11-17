export class GameEndChecker {
  constructor(gameLogic, helperCounts, playToEnd = false) {
    this.gameLogic = gameLogic;
    this.helperCounts = helperCounts;
    this.playToEnd = playToEnd;
  }

  checkWin() {
    if (this.playToEnd) {
      const activeCells = this.getActiveCells();
      return activeCells.length === 0;
    }
    return this.gameLogic.score >= this.gameLogic.targetScore;
  }

  getActiveCells() {
    const crossedOutPositions = this.getCrossedOutPositions();
    const activeCells = [];

    for (let row = 0; row < this.gameLogic.grid.length; row++) {
      for (let col = 0; col < this.gameLogic.grid[row].length; col++) {
        const posKey = `${row},${col}`;
        if (this.gameLogic.grid[row][col] !== null && !crossedOutPositions.has(posKey)) {
          activeCells.push({ row, col, value: this.gameLogic.grid[row][col] });
        }
      }
    }

    return activeCells;
  }

  checkLoss() {
    const maxRowsReached = this.gameLogic.grid.length >= 50;
    if (maxRowsReached) {
      return true;
    }

    const allHelpersUsed =
      (this.helperCounts.eraser || 0) >= 5 &&
      (this.helperCounts.mix || 0) >= 5 &&
      (this.helperCounts.addnumbers || 0) >= 10;

    if (!allHelpersUsed) {
      return false;
    }

    return !this.hasValidMoves();
  }

  hasValidMoves() {
    const activeCells = this.getActiveCells();

    if (activeCells.length === 0) {
      return false;
    }

    const crossedOutPositions = this.getCrossedOutPositions();

    for (let i = 0; i < activeCells.length; i++) {
      for (let j = i + 1; j < activeCells.length; j++) {
        const cell1 = activeCells[i];
        const cell2 = activeCells[j];
        if (
          this.gameLogic.isValidPair(
            cell1.row,
            cell1.col,
            cell2.row,
            cell2.col,
            crossedOutPositions
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  getCrossedOutPositions() {
    const positions = new Set();
    const gridCells = document.querySelectorAll('.grid-cell.crossed-out');
    gridCells.forEach((cell) => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      if (!isNaN(row) && !isNaN(col)) {
        positions.add(`${row},${col}`);
      }
    });
    return positions;
  }
}
