import { Button } from '../components/Button.js';
import { ResultsManager } from './ResultsManager.js';
import { StartScreen } from '../screens/StartScreen.js';

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
    title.textContent = this.result.won ? 'Victory!' : 'Game Over';

    const message = document.createElement('p');
    message.className = 'results-message';
    message.textContent = this.result.won
      ? 'Congratulations! You reached the target score!'
      : 'No more valid moves available.';

    const scoreInfo = document.createElement('div');
    scoreInfo.className = 'results-info';
    scoreInfo.innerHTML = `
      <div class="result-item">
        <span class="result-label">Final Score:</span>
        <span class="result-value">${this.result.finalScore}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Completion Time:</span>
        <span class="result-value">${this.result.completionTime}</span>
      </div>
      <div class="result-item">
        <span class="result-label">Total Moves:</span>
        <span class="result-value">${this.result.totalMoves}</span>
      </div>
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'results-buttons';

    const playAgainBtn = Button.create({
      text: 'Play Again',
      className: 'action-btn',
      onClick: () => {
        document.body.removeChild(modal);
        this.gameScreen.restartGame();
      },
    });

    const mainMenuBtn = Button.create({
      text: 'Main Menu',
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
      text: 'View Results',
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
}
