import { Button } from '../components/Button.js';
import { GameScreen } from './GameScreen.js';
import { AutoLoadHandler } from '../buttons/autoLoadHandler.js';
import { ResultsManager } from '../results/ResultsManager.js';

export class StartScreen {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.createStartScreen();
  }

  createStartScreen() {
    const appWrapper = document.querySelector('.app-wrapper');

    const startScreen = document.createElement('div');
    startScreen.className = 'start-screen';

    const title = document.createElement('h1');
    title.className = 'game-title';
    title.textContent = "Pair 'em Up";

    const authorCredit = document.createElement('div');
    authorCredit.className = 'author-credit';
    const authorLink = document.createElement('a');
    authorLink.href = 'https://github.com/KirrBrest';
    authorLink.target = '_blank';
    authorLink.textContent = 'KirrBrest';
    authorCredit.appendChild(document.createTextNode('Created by '));
    authorCredit.appendChild(authorLink);

    const modeSelection = document.createElement('div');
    modeSelection.className = 'mode-selection';
    const modeTitle = document.createElement('h2');
    modeTitle.textContent = 'Select Game Mode';
    modeSelection.appendChild(modeTitle);

    const modeButtons = document.createElement('div');
    modeButtons.className = 'mode-buttons';

    const classicBtn = Button.create({
      text: 'Classic',
      className: 'mode-btn',
      onClick: () => {
        new GameScreen('classic');
      },
    });

    const randomBtn = Button.create({
      text: 'Random',
      className: 'mode-btn',
      onClick: () => {
        new GameScreen('random');
      },
    });

    const chaoticBtn = Button.create({
      text: 'Chaotic',
      className: 'mode-btn',
      onClick: () => {
        new GameScreen('chaotic');
      },
    });

    const numberSelectionBtn = Button.create({
      text: 'Number Selection',
      className: 'mode-btn',
      onClick: () => {
        this.showNumberSelectionModal();
      },
    });

    modeButtons.appendChild(classicBtn);
    modeButtons.appendChild(randomBtn);
    modeButtons.appendChild(chaoticBtn);
    modeButtons.appendChild(numberSelectionBtn);
    modeSelection.appendChild(modeButtons);

    const gameActions = document.createElement('div');
    gameActions.className = 'game-actions';

    const hasSavedGame = this.checkForSavedGame();
    const continueBtn = Button.create({
      text: 'Continue Game',
      className: 'action-btn continue-btn',
      onClick: hasSavedGame
        ? () => {
            this.loadSavedGame();
          }
        : null,
      disabled: !hasSavedGame,
    });
    const settingsBtn = Button.create({
      text: 'Settings',
      className: 'action-btn settings-btn',
      onClick: () => {
        console.log('Settings clicked');
      },
    });
    const resultsBtn = Button.create({
      text: 'Results',
      className: 'action-btn results-btn',
      onClick: () => {
        this.showResultsTable();
      },
    });

    const themeBtn = Button.create({
      text: 'Theme',
      className: 'action-btn theme-btn',
      onClick: () => {
        console.log('Theme toggle clicked');
      },
    });

    gameActions.appendChild(continueBtn);
    gameActions.appendChild(settingsBtn);
    gameActions.appendChild(resultsBtn);
    gameActions.appendChild(themeBtn);

    startScreen.appendChild(title);
    startScreen.appendChild(authorCredit);
    startScreen.appendChild(modeSelection);
    startScreen.appendChild(gameActions);

    this.createBackgroundText();
    appWrapper.appendChild(startScreen);
    this.container = startScreen;
  }

  checkForSavedGame() {
    const autoSavedGame = localStorage.getItem('pairEmUpAutoSave');
    return autoSavedGame !== null;
  }

  loadSavedGame() {
    const autoSavedGame = localStorage.getItem('pairEmUpAutoSave');
    if (!autoSavedGame) {
      return;
    }

    const gameState = JSON.parse(autoSavedGame);
    const mode = gameState.mode || 'classic';
    const options = gameState.options || {};

    const gameScreen = new GameScreen(mode, options);
    const autoLoadHandler = new AutoLoadHandler(gameScreen);
    autoLoadHandler.handle();
  }

  showResultsTable() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content results-table-modal';

    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = 'Game Results';

    const results = ResultsManager.getResults();
    const table = document.createElement('table');
    table.className = 'results-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>Mode</th>
      <th>Score</th>
      <th>Time</th>
      <th>Moves</th>
      <th>Result</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    if (results.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 5;
      emptyCell.textContent = 'No games completed yet';
      emptyCell.className = 'empty-results';
      emptyRow.appendChild(emptyCell);
      tbody.appendChild(emptyRow);
    } else {
      const sortedResults = [...results].sort((a, b) => {
        const timeA = ResultsManager.parseTime(a.completionTime);
        const timeB = ResultsManager.parseTime(b.completionTime);
        return timeA - timeB;
      });

      sortedResults.forEach((result) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${this.formatMode(result.mode)}</td>
          <td>${result.finalScore}</td>
          <td>${result.completionTime}</td>
          <td>${result.totalMoves}</td>
          <td>${result.won ? '⭐ Win' : 'Loss'}</td>
        `;
        if (result.won) {
          row.classList.add('win-row');
        }
        tbody.appendChild(row);
      });
    }
    table.appendChild(tbody);

    const closeBtn = Button.create({
      text: 'Close',
      className: 'action-btn',
      onClick: () => {
        document.body.removeChild(modal);
      },
    });

    modalContent.appendChild(title);
    modalContent.appendChild(table);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  formatMode(mode) {
    const modeMap = {
      classic: 'Classic',
      random: 'Random',
      chaotic: 'Chaotic',
      numberSelection: 'Number Selection',
    };
    return modeMap[mode] || mode;
  }

  showNumberSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
      background-color: #f5f5dc;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      width: 90%;
      text-align: center;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Select a digit from 1 to 9';
    title.style.cssText = `
      margin: 0 0 20px 0;
      font-family: 'Comic Sans MS', cursive;
      font-size: 1.5rem;
      color: #2c3e50;
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 20px;
    `;

    for (let i = 1; i <= 9; i++) {
      const digitBtn = Button.create({
        text: String(i),
        className: 'mode-btn',
        onClick: () => {
          document.body.removeChild(modal);
          new GameScreen('numberSelection', { selectedDigit: i });
        },
      });
      digitBtn.style.cssText = `
        font-size: 1.5rem;
        padding: 15px;
      `;
      buttonsContainer.appendChild(digitBtn);
    }

    modalContent.appendChild(title);
    modalContent.appendChild(buttonsContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  createBackgroundText() {
    const body = document.body;

    if (document.querySelector('.background-text')) {
      return;
    }

    const backgroundText = document.createElement('div');
    backgroundText.className = 'background-text';

    const lines = [
      'London is the capital of Great Britain.',
      'Sophie and Stephanie are the best sisters in the world - my dear daughters. :)',
      'The cat sat on the mat.',
      'I like to play games with my friends.',
      'The sun shines bright in the sky.',
    ];

    lines.forEach((line, index) => {
      const lineElement = document.createElement('div');
      lineElement.className = 'background-line';
      lineElement.textContent = line;
      lineElement.style.top = `${5 + index * 8}%`;
      backgroundText.appendChild(lineElement);
    });

    const grade = document.createElement('div');
    grade.className = 'background-grade';
    grade.textContent = '10';
    backgroundText.appendChild(grade);

    body.appendChild(backgroundText);
  }
}
