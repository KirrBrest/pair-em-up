import { Button } from '../components/Button.js';
import { GameLogic } from '../game/GameLogic.js';

export class GameScreen {
  constructor(mode, options = {}) {
    this.mode = mode;
    this.options = options;
    this.gameLogic = new GameLogic(mode, options);
    this.container = null;
    this.selectedCells = [];
    this.init();
  }

  init() {
    this.gameLogic.initializeGrid();
    this.createGameScreen();
    this.gameLogic.startTimer();
    this.updateTimer();
  }

  createGameScreen() {
    const appWrapper = document.querySelector('.app-wrapper');
    while (appWrapper.firstChild) {
      appWrapper.removeChild(appWrapper.firstChild);
    }

    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';

    const gamePaper = document.createElement('div');
    gamePaper.className = 'game-paper';

    const header = this.createHeader();
    const gameContent = this.createGameContent();

    gamePaper.appendChild(header);
    gamePaper.appendChild(gameContent);

    gameContainer.appendChild(gamePaper);
    appWrapper.appendChild(gameContainer);

    this.container = gameContainer;
  }

  createHeader() {
    const header = document.createElement('div');
    header.className = 'game-header';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';

    const currentScore = document.createElement('span');
    currentScore.className = 'current-score';
    currentScore.appendChild(document.createTextNode('Score: '));
    const currentScoreStrong = document.createElement('strong');
    currentScoreStrong.textContent = this.gameLogic.score;
    currentScore.appendChild(currentScoreStrong);

    const targetScore = document.createElement('span');
    targetScore.className = 'target-score';
    targetScore.appendChild(document.createTextNode('Target: '));
    const targetScoreStrong = document.createElement('strong');
    targetScoreStrong.textContent = this.gameLogic.targetScore;
    targetScore.appendChild(targetScoreStrong);

    scoreDisplay.appendChild(currentScore);
    scoreDisplay.appendChild(targetScore);

    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer-display';
    timerDisplay.textContent = '00:00';
    this.timerElement = timerDisplay;

    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';

    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'settings-icon-btn';
    settingsBtn.addEventListener('click', () => {
      console.log('Settings clicked');
    });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '28');
    svg.setAttribute('height', '28');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gearGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:rgba(44, 62, 80, 0.8);stop-opacity:1');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('style', 'stop-color:rgba(44, 62, 80, 0.5);stop-opacity:1');

    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('style', 'stop-color:rgba(44, 62, 80, 0.3);stop-opacity:1');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.35 19.43 11.03L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.65 15.5 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.03C4.53 11.35 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.34 8.5 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.5 18.67 16.04 18.34 16.56 17.95L19.05 18.95C19.27 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z'
    );
    path.setAttribute('fill', 'url(#gearGradient)');
    path.setAttribute('opacity', '0.6');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '3.5');
    circle.setAttribute('fill', 'url(#gearGradient)');
    circle.setAttribute('opacity', '0.4');

    svg.appendChild(defs);
    svg.appendChild(path);
    svg.appendChild(circle);
    settingsBtn.appendChild(svg);

    const themeBtn = document.createElement('button');
    themeBtn.className = 'settings-icon-btn theme-icon-btn';
    themeBtn.addEventListener('click', () => {
      console.log('Theme toggle clicked');
    });
    themeBtn.textContent = '🌓';

    timerContainer.appendChild(timerDisplay);
    timerContainer.appendChild(settingsBtn);
    timerContainer.appendChild(themeBtn);

    header.appendChild(scoreDisplay);
    header.appendChild(timerContainer);

    return header;
  }

  createGrid() {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';

    const grid = document.createElement('div');
    grid.className = 'game-grid';

    this.gameLogic.grid.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = rowIndex;
        cell.dataset.col = colIndex;

        if (cellValue !== null) {
          cell.textContent = cellValue;
          cell.classList.add('has-number');
          cell.addEventListener('click', () => this.handleCellClick(cell, rowIndex, colIndex));
        } else {
          cell.classList.add('empty');
        }

        grid.appendChild(cell);
      });
    });

    gridContainer.appendChild(grid);
    return gridContainer;
  }

  handleCellClick(cell, row, col) {
    if (cell.classList.contains('selected')) {
      cell.classList.remove('selected');
      this.selectedCells = this.selectedCells.filter((c) => !(c.row === row && c.col === col));
    } else {
      cell.classList.add('selected');
      this.selectedCells.push({ row, col, element: cell });
    }
  }

  createGameContent() {
    const gameContent = document.createElement('div');
    gameContent.className = 'game-content';

    const leftControls = this.createLeftControls();
    const grid = this.createGrid();
    const rightControls = this.createRightControls();

    gameContent.appendChild(leftControls);
    gameContent.appendChild(grid);
    gameContent.appendChild(rightControls);

    return gameContent;
  }

  createLeftControls() {
    const leftControls = document.createElement('div');
    leftControls.className = 'left-controls';

    const resetBtn = Button.create({
      text: 'Reset',
      className: 'control-btn reset-btn',
      onClick: () => {
        console.log('Reset clicked');
      },
    });

    const saveBtn = Button.create({
      text: 'Save Game',
      className: 'control-btn save-btn',
      onClick: () => {
        console.log('Save game clicked');
      },
    });

    const continueBtn = Button.create({
      text: 'Continue Game',
      className: 'control-btn continue-btn',
      onClick: () => {
        console.log('Continue game clicked');
      },
    });

    leftControls.appendChild(resetBtn);
    leftControls.appendChild(saveBtn);
    leftControls.appendChild(continueBtn);

    return leftControls;
  }

  createRightControls() {
    const rightControls = document.createElement('div');
    rightControls.className = 'right-controls';

    const helpers = [
      { text: 'Hint', count: 3 },
      { text: 'Undo', count: 5 },
      { text: 'Add Numbers', count: 2 },
      { text: 'Shuffle', count: 1 },
      { text: 'Eraser', count: 4 },
    ];

    helpers.forEach((helper) => {
      const helperBtn = Button.create({
        text: `${helper.text} (${helper.count})`,
        className: 'control-btn helper-btn',
        onClick: () => {
          console.log(`${helper.text} clicked`);
        },
      });
      rightControls.appendChild(helperBtn);
    });

    return rightControls;
  }

  updateTimer() {
    if (this.timerElement) {
      this.timerElement.textContent = this.gameLogic.getFormattedTime();
      setTimeout(() => this.updateTimer(), 1000);
    }
  }

  updateScore() {
    const scoreElement = document.querySelector('.current-score strong');
    if (scoreElement) {
      scoreElement.textContent = this.gameLogic.score;
    }
  }
}
