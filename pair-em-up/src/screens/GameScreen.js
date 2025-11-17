import { Button } from '../components/Button.js';
import { GameLogic } from '../game/GameLogic.js';
import { ResetHandler } from '../buttons/resetHandler.js';
import { SaveHandler } from '../buttons/saveHandler.js';
import { ContinueHandler } from '../buttons/continueHandler.js';
import { EraserHandler } from '../buttons/eraserHandler.js';
import { BackHandler } from '../buttons/backHandler.js';
import { StartScreen } from './StartScreen.js';
import { MixHandler } from '../buttons/mixHandler.js';
import { AutoSaveHandler } from '../buttons/autoSaveHandler.js';
import { AddNumbersHandler } from '../buttons/addNumbersHandler.js';
import { SoundManager } from '../audio/SoundManager.js';
import { GameEndChecker } from '../game/GameEndChecker.js';
import { ResultsManager } from '../results/ResultsManager.js';
import { GameResultsModal } from '../results/GameResultsModal.js';

export class GameScreen {
  constructor(mode, options = {}) {
    this.mode = mode;
    this.options = options;
    this.gameLogic = new GameLogic(mode, options);
    this.container = null;
    this.selectedCells = [];
    this.helperCounts = {
      eraser: 0,
      mix: 0,
      addnumbers: 0,
    };
    this.eraserMode = false;
    this.previousState = null;
    this.backUsed = false;
    this.soundManager = new SoundManager();
    this.totalMoves = 0;
    this.gameEnded = false;
    this.playToEnd = false;
    this.init();
  }

  init() {
    this.gameLogic.initializeGrid();
    this.loadPreviousStateFromStorage();
    this.createGameScreen();
    this.gameLogic.startTimer();
    this.updateTimer();
    this.setupAutoSave();
    this.soundManager.playGameStart();
  }

  setupAutoSave() {
    const autoSaveHandler = new AutoSaveHandler(this);
    window.addEventListener('beforeunload', () => {
      autoSaveHandler.handle();
    });

    window.addEventListener('pagehide', () => {
      autoSaveHandler.handle();
    });
  }

  loadPreviousStateFromStorage() {
    const savedPreviousState = localStorage.getItem('pairEmUpPreviousState');
    if (savedPreviousState) {
      try {
        this.previousState = JSON.parse(savedPreviousState);
        this.backUsed = false;
      } catch {
        this.previousState = null;
        this.backUsed = true;
      }
    } else {
      this.previousState = null;
      this.backUsed = true;
    }
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

    const homeBtn = Button.create({
      text: 'Home',
      className: 'control-btn home-btn',
      onClick: () => {
        this.goToStartScreen();
      },
    });

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

    const playToEndLabel = document.createElement('label');
    playToEndLabel.className = 'play-to-end-label';
    const playToEndCheckbox = document.createElement('input');
    playToEndCheckbox.type = 'checkbox';
    playToEndCheckbox.className = 'play-to-end-checkbox';
    playToEndCheckbox.checked = this.playToEnd;
    playToEndCheckbox.addEventListener('change', (e) => {
      this.playToEnd = e.target.checked;
    });
    this.playToEndCheckbox = playToEndCheckbox;
    playToEndLabel.appendChild(playToEndCheckbox);
    playToEndLabel.appendChild(document.createTextNode(' Play to end'));

    scoreDisplay.appendChild(currentScore);
    scoreDisplay.appendChild(targetScore);
    scoreDisplay.appendChild(playToEndLabel);

    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer-display';
    timerDisplay.textContent = '00:00';
    this.timerElement = timerDisplay;

    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';

    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'settings-icon-btn';
    settingsBtn.addEventListener('click', () => {
      this.showSettingsModal();
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

    timerContainer.appendChild(timerDisplay);
    timerContainer.appendChild(settingsBtn);

    header.appendChild(homeBtn);
    header.appendChild(scoreDisplay);
    header.appendChild(timerContainer);

    return header;
  }

  goToStartScreen() {
    const autoSaveHandler = new AutoSaveHandler(this);
    autoSaveHandler.handle();
    this.gameLogic.stopTimer();
    const appWrapper = document.querySelector('.app-wrapper');
    while (appWrapper.firstChild) {
      appWrapper.removeChild(appWrapper.firstChild);
    }
    new StartScreen();
  }

  createGrid(crossedOutCells = []) {
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

        const isCrossedOut = crossedOutCells.some((c) => c.row === rowIndex && c.col === colIndex);

        if (cellValue !== null || isCrossedOut) {
          if (isCrossedOut) {
            const crossedCell = crossedOutCells.find(
              (c) => c.row === rowIndex && c.col === colIndex
            );
            cell.textContent = crossedCell ? crossedCell.value : '';
            cell.classList.add('crossed-out');
          } else {
            cell.textContent = cellValue;
            cell.classList.add('has-number');
          }

          cell.addEventListener('click', () => {
            if (this.eraserMode) {
              this.handleEraserClick(cell);
            } else {
              this.handleCellClick(cell, rowIndex, colIndex);
            }
          });
        } else {
          cell.classList.add('empty');
        }

        grid.appendChild(cell);
      });
    });

    gridContainer.appendChild(grid);
    this.gridElement = grid;
    return gridContainer;
  }

  recreateGrid(crossedOutCells = []) {
    const gameContent = document.querySelector('.game-content');
    if (gameContent) {
      const oldGridContainer = document.querySelector('.grid-container');
      if (oldGridContainer) {
        const newGridContainer = this.createGrid(crossedOutCells);
        oldGridContainer.replaceWith(newGridContainer);
      }
    }
  }

  handleCellClick(cell, row, col) {
    if (cell.classList.contains('crossed-out') || cell.classList.contains('empty')) {
      return;
    }

    if (!cell.classList.contains('has-number')) {
      return;
    }

    if (cell.classList.contains('selected')) {
      cell.classList.remove('selected');
      this.selectedCells = this.selectedCells.filter((c) => !(c.row === row && c.col === col));
      this.soundManager.playDeselect();
      return;
    }

    if (this.selectedCells.length >= 2) {
      this.clearSelection();
    }

    cell.classList.add('selected');
    this.selectedCells.push({ row, col, element: cell });
    this.soundManager.playSelect();

    if (this.selectedCells.length === 2) {
      const [cell1, cell2] = this.selectedCells;
      const crossedOutPositions = this.getCrossedOutPositions();
      if (
        this.gameLogic.isValidPair(cell1.row, cell1.col, cell2.row, cell2.col, crossedOutPositions)
      ) {
        this.crossOutPair(cell1, cell2);
        this.totalMoves++;
        this.updateScore();
        this.soundManager.playValidPair();
        this.checkGameEnd();
      } else {
        this.soundManager.playInvalidPair();
        setTimeout(() => {
          this.clearSelection();
        }, 300);
      }
    }
  }

  clearSelection() {
    this.selectedCells.forEach((cell) => {
      cell.element.classList.remove('selected');
    });
    this.selectedCells = [];
  }

  getCrossedOutPositions() {
    const crossedOutPositions = new Set();
    const gridCells = document.querySelectorAll('.grid-cell.crossed-out');
    gridCells.forEach((cell) => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      if (!isNaN(row) && !isNaN(col)) {
        crossedOutPositions.add(`${row},${col}`);
      }
    });
    return crossedOutPositions;
  }

  showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = 'Settings';

    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'settings-container';

    const audioContainer = document.createElement('div');
    audioContainer.className = 'setting-item';

    const audioLabel = document.createElement('span');
    audioLabel.className = 'setting-label';
    audioLabel.textContent = 'Audio';

    const audioToggle = document.createElement('button');
    audioToggle.className = 'control-btn setting-toggle';
    const audioEnabled = localStorage.getItem('pairEmUpAudio') !== 'false';
    audioToggle.textContent = audioEnabled ? 'ON' : 'OFF';
    audioToggle.addEventListener('click', () => {
      const currentState = localStorage.getItem('pairEmUpAudio') !== 'false';
      const newState = !currentState;
      localStorage.setItem('pairEmUpAudio', String(newState));
      audioToggle.textContent = newState ? 'ON' : 'OFF';
      console.log('Audio toggle clicked');
    });

    audioContainer.appendChild(audioLabel);
    audioContainer.appendChild(audioToggle);

    const themeContainer = document.createElement('div');
    themeContainer.className = 'setting-item';

    const themeLabel = document.createElement('span');
    themeLabel.className = 'setting-label';
    themeLabel.textContent = 'Theme';

    const themeToggle = document.createElement('button');
    themeToggle.className = 'control-btn setting-toggle';
    const themeMode = localStorage.getItem('pairEmUpTheme') || 'light';
    themeToggle.textContent = themeMode === 'dark' ? 'Dark' : 'Light';
    themeToggle.addEventListener('click', () => {
      const currentTheme = localStorage.getItem('pairEmUpTheme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pairEmUpTheme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? 'Dark' : 'Light';
      console.log('Theme toggle clicked');
    });

    themeContainer.appendChild(themeLabel);
    themeContainer.appendChild(themeToggle);

    settingsContainer.appendChild(audioContainer);
    settingsContainer.appendChild(themeContainer);

    modalContent.appendChild(title);
    modalContent.appendChild(settingsContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  crossOutPair(cell1, cell2) {
    this.savePreviousState('pair', {
      cell1: { row: cell1.row, col: cell1.col },
      cell2: { row: cell2.row, col: cell2.col },
    });

    cell1.element.classList.add('crossed-out');
    cell2.element.classList.add('crossed-out');
    cell1.element.classList.remove('selected');
    cell2.element.classList.remove('selected');
    cell1.element.classList.remove('has-number');

    this.gameLogic.removePair(cell1.row, cell1.col, cell2.row, cell2.col);

    this.selectedCells = [];
    this.backUsed = false;
    this.setBackButtonDisabled(false);
  }

  savePreviousState(actionType, actionData) {
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

    const previousState = {
      actionType: actionType,
      actionData: actionData,
      grid: JSON.parse(JSON.stringify(this.gameLogic.grid)),
      score: this.gameLogic.score,
      helperCounts: { ...this.helperCounts },
      crossedOutCells: crossedOutCells,
    };

    this.previousState = previousState;
    localStorage.setItem('pairEmUpPreviousState', JSON.stringify(previousState));
  }

  updateScore() {
    const scoreDisplay = document.querySelector('.current-score strong');
    if (scoreDisplay) {
      scoreDisplay.textContent = this.gameLogic.score;
    }
  }

  checkGameEnd() {
    if (this.gameEnded) {
      return;
    }

    setTimeout(() => {
      if (this.gameEnded) {
        return;
      }

      const endChecker = new GameEndChecker(this.gameLogic, this.helperCounts, this.playToEnd);
      const won = endChecker.checkWin();
      const lost = endChecker.checkLoss();

      if (won || lost) {
        this.gameEnded = true;
        this.gameLogic.stopTimer();
        this.soundManager.playGameEnd();

        const totalSeconds = Math.floor(this.gameLogic.elapsedTime / 1000);
        const completionTime = ResultsManager.formatTime(totalSeconds);
        const result = {
          mode: this.mode,
          finalScore: this.gameLogic.score,
          completionTime: completionTime,
          totalMoves: this.totalMoves,
          won: won,
          timestamp: Date.now(),
        };

        ResultsManager.saveResult(result);

        setTimeout(() => {
          const resultsModal = new GameResultsModal(this, result);
          resultsModal.show();
        }, 500);
      }
    }, 100);
  }

  restartGame() {
    const appWrapper = document.querySelector('.app-wrapper');
    while (appWrapper.firstChild) {
      appWrapper.removeChild(appWrapper.firstChild);
    }
    const newGameScreen = new GameScreen(this.mode, this.options);
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

    const resetHandler = new ResetHandler(this);
    const resetBtn = Button.create({
      text: 'Reset',
      className: 'control-btn reset-btn',
      onClick: () => {
        resetHandler.handle();
      },
    });

    const saveHandler = new SaveHandler(this);
    const saveBtn = Button.create({
      text: 'Save Game',
      className: 'control-btn save-btn',
      onClick: () => {
        saveHandler.handle();
        this.updateContinueButton();
      },
    });

    const continueHandler = new ContinueHandler(this);
    this.continueHandler = continueHandler;
    const hasSavedGame = localStorage.getItem('pairEmUpGame') !== null;
    this.continueBtnClickHandler = () => {
      continueHandler.handle();
    };
    const continueBtn = Button.create({
      text: 'Continue Game',
      className: 'control-btn continue-btn',
      onClick: null,
      disabled: !hasSavedGame,
    });
    if (hasSavedGame) {
      continueBtn.addEventListener('click', this.continueBtnClickHandler);
    }
    this.continueBtn = continueBtn;

    leftControls.appendChild(resetBtn);
    leftControls.appendChild(saveBtn);
    leftControls.appendChild(continueBtn);

    return leftControls;
  }

  createRightControls() {
    const rightControls = document.createElement('div');
    rightControls.className = 'right-controls';

    const helpers = [
      { text: 'Add Numbers', count: 10 },
      { text: 'Mix', count: 5 },
      { text: 'Eraser', count: 5 },
      { text: 'Back', count: '∞' },
    ];

    helpers.forEach((helper) => {
      let buttonText = helper.text;
      if (helper.count !== '∞') {
        const key = helper.text.toLowerCase().replace(' ', '');
        const used = this.helperCounts[key] || 0;
        const remaining = helper.count - used;
        buttonText = `${helper.text} (${remaining})`;
      }
      const helperBtn = Button.create({
        text: buttonText,
        className: 'control-btn helper-btn',
        onClick: () => {
          if (helper.text === 'Eraser') {
            this.toggleEraserMode();
          } else if (helper.text === 'Back') {
            const backHandler = new BackHandler(this);
            backHandler.handle();
          } else if (helper.text === 'Mix') {
            const mixHandler = new MixHandler(this);
            mixHandler.handle();
            this.soundManager.playHelperUse();
            this.checkGameEnd();
          } else if (helper.text === 'Add Numbers') {
            const addNumbersHandler = new AddNumbersHandler(this);
            addNumbersHandler.handle();
            this.soundManager.playHelperUse();
            this.checkGameEnd();
          } else {
            console.log(`${helper.text} clicked`);
          }
        },
      });
      helperBtn.dataset.helperType = helper.text;
      if (helper.text === 'Back' && (this.backUsed || !this.previousState)) {
        helperBtn.disabled = true;
        helperBtn.classList.add('disabled');
      }
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

  toggleEraserMode() {
    this.eraserMode = !this.eraserMode;
    const eraserBtn = document.querySelector('[data-helper-type="Eraser"]');
    if (eraserBtn) {
      if (this.eraserMode) {
        eraserBtn.classList.add('active');
        const remaining = 5 - (this.helperCounts.eraser || 0);
        eraserBtn.textContent = `Cancel (${remaining})`;
      } else {
        eraserBtn.classList.remove('active');
        const remaining = 5 - (this.helperCounts.eraser || 0);
        eraserBtn.textContent = `Eraser (${remaining})`;
      }
    }
  }

  handleEraserClick(cell) {
    const eraserHandler = new EraserHandler(this);
    eraserHandler.handle(cell);
    this.toggleEraserMode();
    this.soundManager.playHelperUse();
    this.checkGameEnd();
  }

  updateHelperButton(helperName, remaining) {
    const helperBtn = document.querySelector(`[data-helper-type="${helperName}"]`);
    if (helperBtn) {
      if (remaining <= 0) {
        helperBtn.disabled = true;
        helperBtn.classList.add('disabled');
      } else {
        helperBtn.disabled = false;
        helperBtn.classList.remove('disabled');
      }
      const baseText = helperName === 'Eraser' ? 'Eraser' : helperName;
      helperBtn.textContent = `${baseText} (${remaining})`;
    }
  }

  updateContinueButton() {
    if (!this.continueBtn) {
      return;
    }

    const hasSavedGame = localStorage.getItem('pairEmUpGame') !== null;
    this.continueBtn.disabled = !hasSavedGame;

    if (hasSavedGame) {
      this.continueBtn.classList.remove('disabled');
      this.continueBtn.removeEventListener('click', this.continueBtnClickHandler);
      this.continueBtn.addEventListener('click', this.continueBtnClickHandler);
    } else {
      this.continueBtn.classList.add('disabled');
      this.continueBtn.removeEventListener('click', this.continueBtnClickHandler);
    }
  }

  updateAllHelperButtons() {
    const helpers = [
      { text: 'Add Numbers', count: 10 },
      { text: 'Mix', count: 5 },
      { text: 'Eraser', count: 5 },
      { text: 'Back', count: '∞' },
    ];

    helpers.forEach((helper) => {
      if (helper.count === '∞') {
        const helperBtn = document.querySelector(`[data-helper-type="${helper.text}"]`);
        if (helperBtn) {
          helperBtn.textContent = helper.text;
          if (helper.text === 'Back') {
            if (this.backUsed || !this.previousState) {
              helperBtn.disabled = true;
              helperBtn.classList.add('disabled');
            } else {
              helperBtn.disabled = false;
              helperBtn.classList.remove('disabled');
            }
          } else {
            helperBtn.disabled = false;
            helperBtn.classList.remove('disabled', 'active');
          }
        }
      } else {
        const key = helper.text.toLowerCase().replace(' ', '');
        const used = this.helperCounts[key] || 0;
        const remaining = helper.count - used;
        this.updateHelperButton(helper.text, remaining);

        if (helper.text === 'Eraser' && this.eraserMode) {
          const eraserBtn = document.querySelector(`[data-helper-type="Eraser"]`);
          if (eraserBtn) {
            eraserBtn.classList.remove('active');
            eraserBtn.textContent = `Eraser (${remaining})`;
          }
          this.eraserMode = false;
        }
      }
    });
  }

  setBackButtonDisabled(disabled) {
    const backBtn = document.querySelector('[data-helper-type="Back"]');
    if (backBtn) {
      backBtn.disabled = disabled;
      if (disabled) {
        backBtn.classList.add('disabled');
      } else {
        backBtn.classList.remove('disabled');
      }
    }
  }
}
