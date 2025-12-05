export class GameLogic {
  constructor(mode, options = {}) {
    this.mode = mode;
    this.options = options;
    this.grid = [];
    this.score = 0;
    this.targetScore = 100;
    this.startTime = null;
    this.elapsedTime = 0;
    this.timerInterval = null;
  }

  initializeGrid() {
    this.grid = [];
    const rows = 3;
    const cols = 9;

    switch (this.mode) {
      case 'classic':
        this.grid = this.generateClassicGrid(rows, cols);
        break;
      case 'random':
        this.grid = this.generateRandomGrid(rows, cols);
        break;
      case 'chaotic':
        this.grid = this.generateChaoticGrid(rows, cols);
        break;
      case 'numberSelection': {
        const selectedDigit = this.options.selectedDigit || 1;
        this.grid = this.generateNumberSelectionGrid(rows, cols, selectedDigit);
        break;
      }
      default:
        this.grid = this.generateClassicGrid(rows, cols);
    }
  }

  generateClassicDigits() {
    const digits = [];

    for (let i = 1; i <= 9; i++) {
      digits.push(i);
    }

    for (let tens = 1; tens <= 9; tens++) {
      for (let ones = 1; ones <= 9; ones++) {
        digits.push(tens);
        digits.push(ones);
      }
    }

    return digits;
  }

  generateClassicGrid(rows, cols) {
    const grid = [];
    const digits = this.generateClassicDigits();

    let index = 0;
    for (let row = 0; row < rows; row++) {
      const rowData = [];
      for (let col = 0; col < cols; col++) {
        if (index < digits.length) {
          rowData.push(digits[index]);
          index++;
        } else {
          rowData.push(null);
        }
      }
      grid.push(rowData);
    }
    return grid;
  }

  generateRandomGrid(rows, cols) {
    const allDigits = this.generateClassicDigits();
    const totalCells = rows * cols;
    const digits = allDigits.slice(0, totalCells);

    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    const grid = [];
    let index = 0;
    for (let row = 0; row < rows; row++) {
      const rowData = [];
      for (let col = 0; col < cols; col++) {
        if (index < digits.length) {
          rowData.push(digits[index]);
          index++;
        } else {
          rowData.push(null);
        }
      }
      grid.push(rowData);
    }
    return grid;
  }

  generateChaoticGrid(rows, cols) {
    const grid = [];
    const numbers = [];
    for (let i = 0; i < 27; i++) {
      numbers.push(Math.floor(Math.random() * 9) + 1);
    }

    let index = 0;
    for (let row = 0; row < rows; row++) {
      const rowData = [];
      for (let col = 0; col < cols; col++) {
        if (index < numbers.length) {
          rowData.push(numbers[index]);
          index++;
        } else {
          rowData.push(null);
        }
      }
      grid.push(rowData);
    }
    return grid;
  }

  generateNumberSelectionGrid(rows, cols, selectedDigit) {
    const grid = [];
    const firstRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    grid.push(firstRow);

    for (let row = 1; row < rows; row++) {
      const rowData = [];
      for (let onesDigit = 1; onesDigit <= 9; onesDigit++) {
        rowData.push(selectedDigit);
        rowData.push(onesDigit);
      }
      if (rowData.length > cols) {
        rowData.splice(cols);
      }
      grid.push(rowData);
    }
    return grid;
  }

  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getFormattedTime() {
    const totalSeconds = Math.floor(this.elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  reset() {
    this.score = 0;
    this.elapsedTime = 0;
    this.stopTimer();
    this.initializeGrid();
  }

  areNeighbors(row1, col1, row2, col2, crossedOutPositions = null) {
    if (row1 === row2 && col1 === col2) {
      return false;
    }

    const sameRow = row1 === row2;
    const sameCol = col1 === col2;
    const adjacentRows = Math.abs(row1 - row2) === 1;
    const adjacentCols = Math.abs(col1 - col2) === 1;

    if (sameRow && adjacentCols) {
      return true;
    }

    if (sameCol && adjacentRows) {
      return true;
    }

    const isCellActive = (row, col) => {
      if (this.grid[row][col] === null) {
        return false;
      }
      if (crossedOutPositions) {
        const posKey = `${row},${col}`;
        return !crossedOutPositions.has(posKey);
      }
      return true;
    };

    if (sameRow) {
      const minCol = Math.min(col1, col2);
      const maxCol = Math.max(col1, col2);
      for (let c = minCol + 1; c < maxCol; c++) {
        if (isCellActive(row1, c)) {
          return false;
        }
      }
      return true;
    }

    if (sameCol) {
      const minRow = Math.min(row1, row2);
      const maxRow = Math.max(row1, row2);
      for (let r = minRow + 1; r < maxRow; r++) {
        if (isCellActive(r, col1)) {
          return false;
        }
      }
      return true;
    }

    if (adjacentRows) {
      const lastColRow1 = this.getLastNonEmptyCol(row1, crossedOutPositions);
      const firstColRow2 = this.getFirstNonEmptyCol(row2, crossedOutPositions);
      const lastColRow2 = this.getLastNonEmptyCol(row2, crossedOutPositions);
      const firstColRow1 = this.getFirstNonEmptyCol(row1, crossedOutPositions);

      if (row2 === row1 + 1 && col1 === lastColRow1 && col2 === firstColRow2) {
        return true;
      }

      if (row1 === row2 + 1 && col1 === firstColRow1 && col2 === lastColRow2) {
        return true;
      }
    }

    const rowDiff = Math.abs(row1 - row2);
    if (rowDiff > 1) {
      const minRow = Math.min(row1, row2);
      const maxRow = Math.max(row1, row2);

      for (let r = minRow + 1; r < maxRow; r++) {
        for (let c = 0; c < this.grid[r].length; c++) {
          if (isCellActive(r, c)) {
            return false;
          }
        }
      }

      const lastColRow1 = this.getLastNonEmptyCol(row1, crossedOutPositions);
      const firstColRow2 = this.getFirstNonEmptyCol(row2, crossedOutPositions);
      const lastColRow2 = this.getLastNonEmptyCol(row2, crossedOutPositions);
      const firstColRow1 = this.getFirstNonEmptyCol(row1, crossedOutPositions);

      if (row1 < row2 && col1 === lastColRow1 && col2 === firstColRow2) {
        return true;
      }

      if (row1 > row2 && col1 === firstColRow1 && col2 === lastColRow2) {
        return true;
      }
    }

    return false;
  }

  getLastNonEmptyCol(row, crossedOutPositions = null) {
    for (let col = this.grid[row].length - 1; col >= 0; col--) {
      if (this.grid[row][col] !== null) {
        if (crossedOutPositions) {
          const posKey = `${row},${col}`;
          if (!crossedOutPositions.has(posKey)) {
            return col;
          }
        } else {
          return col;
        }
      }
    }
    return -1;
  }

  getFirstNonEmptyCol(row, crossedOutPositions = null) {
    for (let col = 0; col < this.grid[row].length; col++) {
      if (this.grid[row][col] !== null) {
        if (crossedOutPositions) {
          const posKey = `${row},${col}`;
          if (!crossedOutPositions.has(posKey)) {
            return col;
          }
        } else {
          return col;
        }
      }
    }
    return -1;
  }

  isValidPair(row1, col1, row2, col2, crossedOutPositions = null) {
    if (
      row1 < 0 ||
      row1 >= this.grid.length ||
      col1 < 0 ||
      col1 >= this.grid[0].length ||
      row2 < 0 ||
      row2 >= this.grid.length ||
      col2 < 0 ||
      col2 >= this.grid[0].length
    ) {
      return false;
    }

    const value1 = this.grid[row1][col1];
    const value2 = this.grid[row2][col2];

    if (value1 === null || value2 === null) {
      return false;
    }

    if (crossedOutPositions) {
      const pos1Key = `${row1},${col1}`;
      const pos2Key = `${row2},${col2}`;
      if (crossedOutPositions.has(pos1Key) || crossedOutPositions.has(pos2Key)) {
        return false;
      }
    }

    if (!this.areNeighbors(row1, col1, row2, col2, crossedOutPositions)) {
      return false;
    }

    if (value1 === value2) {
      return true;
    }

    if (value1 + value2 === 10) {
      return true;
    }

    return false;
  }

  getPairScore(row1, col1, row2, col2) {
    const value1 = this.grid[row1][col1];
    const value2 = this.grid[row2][col2];

    if (value1 === 5 && value2 === 5) {
      return 3;
    }

    if (value1 === value2) {
      return 1;
    }

    if (value1 + value2 === 10) {
      return 2;
    }

    return 0;
  }

  removePair(row1, col1, row2, col2) {
    const score = this.getPairScore(row1, col1, row2, col2);
    this.score += score;

    this.grid[row1][col1] = null;
    this.grid[row2][col2] = null;
  }
}
