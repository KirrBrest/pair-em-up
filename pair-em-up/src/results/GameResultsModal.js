import { Button } from '../components/Button.js';
import { ResultsManager } from './ResultsManager.js';
import { StartScreen } from '../screens/StartScreen.js';
import { languageManager } from '../utils/LanguageManager.js';

export class GameResultsModal {
  constructor(gameScreen, result) {
    this.gameScreen = gameScreen;
    this.result = result;
  }

  show() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content results-modal';

    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = this.result.won
      ? languageManager.t('victory')
      : languageManager.t('gameOver');

    const message = document.createElement('p');
    message.className = 'results-message';
    message.textContent = this.result.won
      ? languageManager.t('congratulations')
      : languageManager.t('noMoreMoves');

    const scoreInfo = document.createElement('div');
    scoreInfo.className = 'results-info';
    scoreInfo.innerHTML = `
      <div class="result-item">
        <span class="result-label">${languageManager.t('finalScore')}:</span>
        <span class="result-value">${this.result.finalScore}</span>
      </div>
      <div class="result-item">
        <span class="result-label">${languageManager.t('completionTime')}:</span>
        <span class="result-value">${this.result.completionTime}</span>
      </div>
      <div class="result-item">
        <span class="result-label">${languageManager.t('totalMoves')}:</span>
        <span class="result-value">${this.result.totalMoves}</span>
      </div>
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'results-buttons';

    const playAgainBtn = Button.create({
      text: languageManager.t('playAgain'),
      className: 'action-btn',
      onClick: () => {
        document.body.removeChild(modal);
        this.gameScreen.restartGame();
      },
    });

    const mainMenuBtn = Button.create({
      text: languageManager.t('mainMenu'),
      className: 'action-btn',
      onClick: () => {
        document.body.removeChild(modal);
        const appWrapper = document.querySelector('.app-wrapper');
        while (appWrapper.firstChild) {
          appWrapper.removeChild(appWrapper.firstChild);
        }
        new StartScreen();
      },
    });

    const viewResultsBtn = Button.create({
      text: languageManager.t('viewResults'),
      className: 'action-btn',
      onClick: () => {
        document.body.removeChild(modal);
        this.showResultsTable();
      },
    });

    buttonsContainer.appendChild(playAgainBtn);
    buttonsContainer.appendChild(mainMenuBtn);
    buttonsContainer.appendChild(viewResultsBtn);

    modalContent.appendChild(title);
    modalContent.appendChild(message);
    modalContent.appendChild(scoreInfo);
    modalContent.appendChild(buttonsContainer);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        const appWrapper = document.querySelector('.app-wrapper');
        while (appWrapper.firstChild) {
          appWrapper.removeChild(appWrapper.firstChild);
        }
        new StartScreen();
      }
    });
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
}
