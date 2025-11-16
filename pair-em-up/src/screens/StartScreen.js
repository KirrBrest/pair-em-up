import { Button } from '../components/Button.js';
import { GameScreen } from './GameScreen.js';

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
        new GameScreen('numberSelection', { tensDigit: 1 });
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
            console.log('Continue game clicked');
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
        console.log('Results clicked');
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
    const savedGame = localStorage.getItem('pairEmUpGame');
    return savedGame !== null;
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
      'Sofy and Stefany are the best sisters in the world.',
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
