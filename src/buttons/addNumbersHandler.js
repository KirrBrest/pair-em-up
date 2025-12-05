export class AddNumbersHandler {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.maxUses = 10;
  }

  handle() {
    if (!this.gameScreen.helperCounts) {
      this.gameScreen.helperCounts = {};
    }

    const currentUses = this.gameScreen.helperCounts.addNumbers || 0;

    if (currentUses >= this.maxUses) {
      return;
    }

    this.gameScreen.savePreviousState('addNumbers', {});

    const crossedOutPositions = new Set();
    const gridCells = document.querySelectorAll('.grid-cell.crossed-out');
    gridCells.forEach((cell) => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      if (!isNaN(row) && !isNaN(col)) {
        crossedOutPositions.add(`${row},${col}`);
      }
    });

    const remainingNumbers = [];
    this.gameScreen.gameLogic.grid.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const posKey = `${rowIndex},${colIndex}`;
        if (cellValue !== null && !crossedOutPositions.has(posKey)) {
          remainingNumbers.push(cellValue);
        }
      });
    });

    if (remainingNumbers.length === 0) {
      return;
    }

    let numbersToAdd = [];
    const mode = this.gameScreen.mode;

    if (mode === 'chaotic') {
      for (let i = 0; i < remainingNumbers.length; i++) {
        numbersToAdd.push(Math.floor(Math.random() * 9) + 1);
      }
    } else if (mode === 'random') {
      numbersToAdd = [...remainingNumbers];
      for (let i = numbersToAdd.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbersToAdd[i], numbersToAdd[j]] = [numbersToAdd[j], numbersToAdd[i]];
      }
    } else {
      numbersToAdd = [...remainingNumbers];
    }

    const cols = 9;
    let lastFilledRow = -1;
    let lastFilledCol = -1;

    for (let row = this.gameScreen.gameLogic.grid.length - 1; row >= 0; row--) {
      for (let col = cols - 1; col >= 0; col--) {
        const posKey = `${row},${col}`;
        if (this.gameScreen.gameLogic.grid[row][col] !== null && !crossedOutPositions.has(posKey)) {
          lastFilledRow = row;
          lastFilledCol = col;
          break;
        }
      }
      if (lastFilledRow !== -1) break;
    }

    let numbersIndex = 0;
    let currentRowIndex = lastFilledRow;
    let currentColIndex = lastFilledCol + 1;

    if (currentRowIndex === -1) {
      currentRowIndex = 0;
      currentColIndex = 0;
    }

    while (numbersIndex < numbersToAdd.length) {
      if (currentColIndex >= cols) {
        currentRowIndex++;
        currentColIndex = 0;
        if (currentRowIndex >= this.gameScreen.gameLogic.grid.length) {
          this.gameScreen.gameLogic.grid.push(new Array(cols).fill(null));
        }
      }

      const posKey = `${currentRowIndex},${currentColIndex}`;
      const cellValue = this.gameScreen.gameLogic.grid[currentRowIndex][currentColIndex];
      const isCrossedOut = crossedOutPositions.has(posKey);

      if (cellValue === null && !isCrossedOut) {
        this.gameScreen.gameLogic.grid[currentRowIndex][currentColIndex] =
          numbersToAdd[numbersIndex];
        numbersIndex++;
      }
      currentColIndex++;
    }

    this.gameScreen.helperCounts.addNumbers = currentUses + 1;
    const remaining = this.maxUses - this.gameScreen.helperCounts.addNumbers;
    this.gameScreen.updateHelperButton('AddNumbers', remaining);
    this.gameScreen.updateHints();
    if (this.gameScreen.helpMode) {
      this.gameScreen.highlightValidPairs();
    }
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
