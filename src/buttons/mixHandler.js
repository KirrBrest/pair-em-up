export class MixHandler {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.maxUses = 5;
  }

  handle() {
    if (!this.gameScreen.helperCounts) {
      this.gameScreen.helperCounts = {};
    }

    const currentUses = this.gameScreen.helperCounts.mix || 0;

    if (currentUses >= this.maxUses) {
      return;
    }

    this.gameScreen.savePreviousState('mix', {});

    const crossedOutPositions = new Set();
    const gridCells = document.querySelectorAll('.grid-cell.crossed-out');
    gridCells.forEach((cell) => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      if (!isNaN(row) && !isNaN(col)) {
        crossedOutPositions.add(`${row},${col}`);
      }
    });

    const allNumbers = [];
    const positions = [];

    this.gameScreen.gameLogic.grid.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const posKey = `${rowIndex},${colIndex}`;
        if (cellValue !== null && !crossedOutPositions.has(posKey)) {
          allNumbers.push(cellValue);
          positions.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    for (let i = allNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allNumbers[i], allNumbers[j]] = [allNumbers[j], allNumbers[i]];
    }

    let numberIndex = 0;
    positions.forEach((pos) => {
      this.gameScreen.gameLogic.grid[pos.row][pos.col] = allNumbers[numberIndex];
      numberIndex++;
    });

    this.gameScreen.helperCounts.mix = currentUses + 1;
    const remaining = this.maxUses - this.gameScreen.helperCounts.mix;
    this.gameScreen.updateHelperButton('Mix', remaining);
    this.gameScreen.backUsed = false;
    this.gameScreen.setBackButtonDisabled(false);

    this.gameScreen.selectedCells = [];
    this.gameScreen.clearSelection();

    const crossedOutCells = [];
    gridCells.forEach((cell) => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const value = cell.textContent.trim();
      if (!isNaN(row) && !isNaN(col) && row >= 0 && col >= 0 && value && value !== '') {
        crossedOutCells.push({ row, col, value: parseInt(value) || value });
      }
    });

    this.gameScreen.recreateGrid(crossedOutCells);
  }
}
