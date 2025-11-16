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
        const tensDigit = this.options.tensDigit || 1;
        this.grid = this.generateNumberSelectionGrid(rows, cols, tensDigit);
        break;
      }
      default:
        this.grid = this.generateClassicGrid(rows, cols);
    }
  }

  generateClassicGrid(rows, cols) {
    const grid = [];
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

  generateNumberSelectionGrid(rows, cols, tensDigit) {
    const grid = [];
    const firstRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    grid.push(firstRow);

    for (let row = 1; row < rows; row++) {
      const rowData = [];
      for (let onesDigit = 1; onesDigit <= 9; onesDigit++) {
        const number = tensDigit * 10 + onesDigit;
        rowData.push(number);
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
}
