import { Button } from '../components/Button.js';
import { GameScreen } from './GameScreen.js';
import { AutoLoadHandler } from '../buttons/autoLoadHandler.js';
import { ResultsManager } from '../results/ResultsManager.js';
import { ThemeManager } from '../utils/ThemeManager.js';
import { languageManager } from '../utils/LanguageManager.js';

export class StartScreen {
  constructor() {
    this.container = null;
    ThemeManager.init();
    this.init();
  }

  init() {
    this.createStartScreen();
  }

  createStartScreen() {
    const appWrapper = document.querySelector('.app-wrapper');

    const startScreen = document.createElement('div');
    startScreen.className = 'start-screen';

    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';

    const title = document.createElement('h1');
    title.className = 'game-title';
    title.textContent = languageManager.t('gameTitle');

    const languageBtn = document.createElement('button');
    languageBtn.className = 'language-toggle-btn';
    const currentLang = languageManager.getLanguage();
    languageBtn.textContent = currentLang === 'ru' ? 'EN' : 'RU';
    languageBtn.title = currentLang === 'ru' ? 'Switch to English' : 'Переключить на русский';
    languageBtn.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'ru' : 'en';
      languageManager.setLanguage(newLang);
      const appWrapper = document.querySelector('.app-wrapper');
      while (appWrapper.firstChild) {
        appWrapper.removeChild(appWrapper.firstChild);
      }
      this.createStartScreen();
    });

    titleContainer.appendChild(title);
    titleContainer.appendChild(languageBtn);

    const authorCredit = document.createElement('div');
    authorCredit.className = 'author-credit';
    const authorLink = document.createElement('a');
    authorLink.href = 'https://github.com/KirrBrest';
    authorLink.target = '_blank';
    authorLink.textContent = 'KirrBrest';
    authorCredit.appendChild(document.createTextNode(`${languageManager.t('createdBy')} `));
    authorCredit.appendChild(authorLink);

    const modeSelection = document.createElement('div');
    modeSelection.className = 'mode-selection';
    const modeTitle = document.createElement('h2');
    modeTitle.textContent = languageManager.t('selectGameMode');
    modeSelection.appendChild(modeTitle);

    const modeButtons = document.createElement('div');
    modeButtons.className = 'mode-buttons';

    const classicBtn = Button.create({
      text: languageManager.t('classic'),
      className: 'mode-btn',
      onClick: () => {
        new GameScreen('classic');
      },
    });

    const randomBtn = Button.create({
      text: languageManager.t('random'),
      className: 'mode-btn',
      onClick: () => {
        new GameScreen('random');
      },
    });

    const chaoticBtn = Button.create({
      text: languageManager.t('chaotic'),
      className: 'mode-btn',
      onClick: () => {
        new GameScreen('chaotic');
      },
    });

    const numberSelectionBtn = Button.create({
      text: languageManager.t('numberSelection'),
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
      text: languageManager.t('continueGame'),
      className: 'action-btn continue-btn',
      onClick: hasSavedGame
        ? () => {
            this.loadSavedGame();
          }
        : null,
      disabled: !hasSavedGame,
    });
    const settingsBtn = Button.create({
      text: languageManager.t('settings'),
      className: 'action-btn settings-btn',
      onClick: () => {
        this.showSettingsModal();
      },
    });
    const resultsBtn = Button.create({
      text: languageManager.t('results'),
      className: 'action-btn results-btn',
      onClick: () => {
        this.showResultsTable();
      },
    });
    const instructionsBtn = Button.create({
      text: languageManager.t('instructions'),
      className: 'action-btn instructions-btn',
      onClick: () => {
        this.showInstructionsModal();
      },
    });

    gameActions.appendChild(continueBtn);
    gameActions.appendChild(settingsBtn);
    gameActions.appendChild(resultsBtn);
    gameActions.appendChild(instructionsBtn);

    startScreen.appendChild(titleContainer);
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
    title.textContent = languageManager.t('gameResults');

    const results = ResultsManager.getResults();
    const table = document.createElement('table');
    table.className = 'results-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
      <th>${languageManager.t('mode')}</th>
      <th>${languageManager.t('score')}</th>
      <th>${languageManager.t('time')}</th>
      <th>${languageManager.t('moves')}</th>
      <th>${languageManager.t('result')}</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    if (results.length === 0) {
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 5;
      emptyCell.textContent = languageManager.t('noGamesCompleted');
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
          <td>${result.won ? `⭐ ${languageManager.t('win')}` : languageManager.t('loss')}</td>
        `;
        if (result.won) {
          row.classList.add('win-row');
        }
        tbody.appendChild(row);
      });
    }
    table.appendChild(tbody);

    const closeBtn = Button.create({
      text: languageManager.t('close'),
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
      classic: languageManager.t('classic'),
      random: languageManager.t('random'),
      chaotic: languageManager.t('chaotic'),
      numberSelection: languageManager.t('numberSelection'),
    };
    return modeMap[mode] || mode;
  }

  showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = languageManager.t('settings');

    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'settings-container';

    const audioContainer = document.createElement('div');
    audioContainer.className = 'setting-item';

    const audioLabel = document.createElement('span');
    audioLabel.className = 'setting-label';
    audioLabel.textContent = languageManager.t('audio');

    const audioToggle = document.createElement('button');
    audioToggle.className = 'control-btn setting-toggle';
    const audioEnabled = localStorage.getItem('pairEmUpAudio') !== 'false';
    audioToggle.textContent = audioEnabled ? languageManager.t('on') : languageManager.t('off');
    audioToggle.addEventListener('click', () => {
      const currentState = localStorage.getItem('pairEmUpAudio') !== 'false';
      const newState = !currentState;
      localStorage.setItem('pairEmUpAudio', String(newState));
      audioToggle.textContent = newState ? languageManager.t('on') : languageManager.t('off');
    });

    audioContainer.appendChild(audioLabel);
    audioContainer.appendChild(audioToggle);

    const musicContainer = document.createElement('div');
    musicContainer.className = 'setting-item';

    const musicLabel = document.createElement('span');
    musicLabel.className = 'setting-label';
    musicLabel.textContent = languageManager.t('music');

    const musicCheckbox = document.createElement('input');
    musicCheckbox.type = 'checkbox';
    musicCheckbox.className = 'play-to-end-checkbox';
    const musicEnabled = localStorage.getItem('pairEmUpMusic') !== 'false';
    musicCheckbox.checked = musicEnabled;
    musicCheckbox.addEventListener('change', () => {
      localStorage.setItem('pairEmUpMusic', String(musicCheckbox.checked));
    });

    const musicLabelWrapper = document.createElement('label');
    musicLabelWrapper.className = 'play-to-end-label';
    musicLabelWrapper.appendChild(musicCheckbox);
    musicLabelWrapper.appendChild(document.createTextNode(' '));
    musicLabelWrapper.appendChild(musicLabel);

    musicContainer.appendChild(musicLabelWrapper);

    const themeContainer = document.createElement('div');
    themeContainer.className = 'setting-item';

    const themeLabel = document.createElement('span');
    themeLabel.className = 'setting-label';
    themeLabel.textContent = languageManager.t('theme');

    const themeToggle = document.createElement('button');
    themeToggle.className = 'control-btn setting-toggle';
    const themeMode = ThemeManager.getCurrentTheme();
    themeToggle.textContent =
      themeMode === 'dark' ? languageManager.t('dark') : languageManager.t('light');
    themeToggle.addEventListener('click', () => {
      const newTheme = ThemeManager.toggleTheme();
      themeToggle.textContent =
        newTheme === 'dark' ? languageManager.t('dark') : languageManager.t('light');
      this.updateButtons();
    });

    themeContainer.appendChild(themeLabel);
    themeContainer.appendChild(themeToggle);

    const languageContainer = document.createElement('div');
    languageContainer.className = 'setting-item';

    const languageLabel = document.createElement('span');
    languageLabel.className = 'setting-label';
    languageLabel.textContent = languageManager.t('language');

    const languageToggle = document.createElement('button');
    languageToggle.className = 'control-btn setting-toggle';
    const currentLang = languageManager.getLanguage();
    languageToggle.textContent =
      currentLang === 'ru' ? languageManager.t('english') : languageManager.t('russian');
    languageToggle.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'ru' : 'en';
      languageManager.setLanguage(newLang);
      document.body.removeChild(modal);
      const appWrapper = document.querySelector('.app-wrapper');
      while (appWrapper.firstChild) {
        appWrapper.removeChild(appWrapper.firstChild);
      }
      this.createStartScreen();
    });

    languageContainer.appendChild(languageLabel);
    languageContainer.appendChild(languageToggle);

    settingsContainer.appendChild(audioContainer);
    settingsContainer.appendChild(musicContainer);
    settingsContainer.appendChild(themeContainer);
    settingsContainer.appendChild(languageContainer);

    const closeBtn = Button.create({
      text: languageManager.t('close'),
      className: 'action-btn',
      onClick: () => {
        document.body.removeChild(modal);
      },
    });

    modalContent.appendChild(title);
    modalContent.appendChild(settingsContainer);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  updateButtons() {
    const buttons = document.querySelectorAll('.action-btn, .control-btn, .mode-btn');
    buttons.forEach((btn) => {
      btn.style.backgroundColor = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    });
  }

  showNumberSelectionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content number-selection-modal';

    const title = document.createElement('h2');
    title.className = 'number-selection-title';
    title.textContent = languageManager.t('selectDigitFrom1To9');

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'number-selection-buttons';

    for (let i = 1; i <= 9; i++) {
      const digitBtn = Button.create({
        text: String(i),
        className: 'mode-btn digit-selection-btn',
        onClick: () => {
          document.body.removeChild(modal);
          new GameScreen('numberSelection', { selectedDigit: i });
        },
      });
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

  showInstructionsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content instructions-modal';

    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = languageManager.t('instructionsTitle');

    const instructionsContainer = document.createElement('div');
    instructionsContainer.className = 'instructions-container';

    const createSection = (sectionTitle, sectionText) => {
      const section = document.createElement('div');
      section.className = 'instruction-section';

      const sectionTitleEl = document.createElement('h3');
      sectionTitleEl.className = 'instruction-section-title';
      sectionTitleEl.textContent = sectionTitle;

      const sectionTextEl = document.createElement('p');
      sectionTextEl.className = 'instruction-section-text';
      sectionTextEl.textContent = sectionText;

      section.appendChild(sectionTitleEl);
      section.appendChild(sectionTextEl);
      return section;
    };

    instructionsContainer.appendChild(
      createSection(
        languageManager.t('instructionsGoal'),
        languageManager.t('instructionsGoalText')
      )
    );

    instructionsContainer.appendChild(
      createSection(
        languageManager.t('instructionsValidPairs'),
        languageManager.t('instructionsValidPairsText')
      )
    );

    instructionsContainer.appendChild(
      createSection(
        languageManager.t('instructionsPairRules'),
        languageManager.t('instructionsPairRulesText')
      )
    );

    instructionsContainer.appendChild(
      createSection(
        languageManager.t('instructionsGameModes'),
        languageManager.t('instructionsGameModesText')
      )
    );

    instructionsContainer.appendChild(
      createSection(
        languageManager.t('instructionsHelpers'),
        languageManager.t('instructionsHelpersText')
      )
    );

    instructionsContainer.appendChild(
      createSection(
        languageManager.t('instructionsControls'),
        languageManager.t('instructionsControlsText')
      )
    );

    instructionsContainer.appendChild(
      createSection(
        languageManager.t('instructionsWinConditions'),
        languageManager.t('instructionsWinConditionsText')
      )
    );

    instructionsContainer.appendChild(
      createSection(
        languageManager.t('instructionsLossConditions'),
        languageManager.t('instructionsLossConditionsText')
      )
    );

    const closeBtn = Button.create({
      text: languageManager.t('close'),
      className: 'action-btn',
      onClick: () => {
        document.body.removeChild(modal);
      },
    });

    modalContent.appendChild(title);
    modalContent.appendChild(instructionsContainer);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
}
