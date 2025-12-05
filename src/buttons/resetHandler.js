export class ResetHandler {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
  }

  handle() {
    this.gameScreen.gameLogic.reset();
    this.gameScreen.gameLogic.startTimer();
    this.gameScreen.selectedCells = [];
    this.gameScreen.clearSelection();
    this.gameScreen.helperCounts = {
      eraser: 0,
      mix: 0,
      addnumbers: 0,
    };
    this.gameScreen.eraserMode = false;
    this.gameScreen.previousState = null;
    this.gameScreen.backUsed = true;
    this.gameScreen.recreateGrid();
    this.gameScreen.updateScore();
    this.gameScreen.updateTimer();
    this.gameScreen.updateAllHelperButtons();
    localStorage.removeItem('pairEmUpPreviousState');
    localStorage.removeItem('pairEmUpAutoSave');
  }
}
