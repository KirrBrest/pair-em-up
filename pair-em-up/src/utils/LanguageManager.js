const translations = {
  en: {
    gameTitle: "Pair 'em Up",
    createdBy: 'Created by',
    selectGameMode: 'Select Game Mode',
    classic: 'Classic',
    random: 'Random',
    chaotic: 'Chaotic',
    numberSelection: 'Number Selection',
    continueGame: 'Continue Game',
    settings: 'Settings',
    results: 'Results',
    home: 'Home',
    score: 'Score',
    target: 'Target',
    hints: 'Hints',
    playToEnd: 'Play to end',
    reset: 'Reset',
    saveGame: 'Save Game',
    addNumbers: 'Add Numbers',
    mix: 'Mix',
    eraser: 'Eraser',
    back: 'Back',
    help: 'Help',
    cancel: 'Cancel',
    audio: 'Audio',
    music: 'Music',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    english: 'English',
    russian: 'Russian',
    on: 'ON',
    off: 'OFF',
    victory: 'Victory!',
    gameOver: 'Game Over',
    congratulations: 'Congratulations! You reached the target score!',
    noMoreMoves: 'No more valid moves available.',
    finalScore: 'Final Score',
    completionTime: 'Completion Time',
    totalMoves: 'Total Moves',
    playAgain: 'Play Again',
    mainMenu: 'Main Menu',
    viewResults: 'View Results',
    gameResults: 'Game Results',
    mode: 'Mode',
    time: 'Time',
    moves: 'Moves',
    result: 'Result',
    win: 'Win',
    loss: 'Loss',
    close: 'Close',
    noGamesCompleted: 'No games completed yet',
    selectDigit: 'Select Digit',
    selectDigitFrom1To9: 'Select a digit from 1 to 9',
    thisDigitWillStart: 'This digit will start the second row.',
    instructions: 'Instructions',
    instructionsTitle: 'Game Instructions',
    instructionsGoal: 'Goal',
    instructionsGoalText:
      'Clear the board by matching pairs of numbers. Win by reaching 100 points or clearing all numbers (if "Play to end" is enabled).',
    instructionsValidPairs: 'Valid Pairs',
    instructionsValidPairsText:
      '• Same numbers (e.g., 7 and 7) - 1 point\n• Sum to 10 (e.g., 3 and 7, 4 and 6) - 2 points\n• Double 5 (5 and 5) - 3 points',
    instructionsPairRules: 'Pair Connection Rules',
    instructionsPairRulesText:
      '• Adjacent cells: Numbers in vertically or horizontally adjacent cells can always be paired\n• Same row/column: Numbers in the same row or column can be paired if cells between them are empty\n• Row boundaries: The last number of one row can pair with the first number of the next row',
    instructionsGameModes: 'Game Modes',
    instructionsGameModesText:
      '• Classic: Sequential numbers from 1 to 19 (excluding 0), arranged in order\n• Random: Numbers from 1 to 19 (excluding 0), arranged randomly\n• Chaotic: Exactly 27 random numbers using only digits 1-9\n• Number Selection: Choose a digit (1-9) to start the second row',
    instructionsHelpers: 'Helper Tools',
    instructionsHelpersText:
      '• Add Numbers (10 uses): Adds remaining numbers to the grid\n• Mix (5 uses): Randomly rearranges all active numbers\n• Eraser (5 uses): Removes any single number\n• Back (unlimited): Undo the last action\n• Help (unlimited): Highlights valid pairs on the board',
    instructionsControls: 'Controls',
    instructionsControlsText:
      '• Reset: Restart the current game\n• Save Game: Save current game state\n• Continue Game: Load previously saved game\n• Settings: Audio, music, theme, and language settings',
    instructionsWinConditions: 'Win Conditions',
    instructionsWinConditionsText:
      '• Reach 100 points (default)\n• Clear all numbers (if "Play to end" is enabled)',
    instructionsLossConditions: 'Loss Conditions',
    instructionsLossConditionsText:
      '• No valid moves available and all helpers used\n• Grid limit of 50 rows reached',
  },
  ru: {
    gameTitle: 'Собери пары',
    createdBy: 'Создано',
    selectGameMode: 'Выберите режим игры',
    classic: 'Классический',
    random: 'Случайный',
    chaotic: 'Хаотичный',
    numberSelection: 'Выбор цифры',
    continueGame: 'Продолжить игру',
    settings: 'Настройки',
    results: 'Результаты',
    home: 'Главная',
    score: 'Счёт',
    target: 'Цель',
    hints: 'Подсказки',
    playToEnd: 'Играть до конца',
    reset: 'Сброс',
    saveGame: 'Сохранить игру',
    addNumbers: 'Добавить цифры',
    mix: 'Перемешать',
    eraser: 'Ластик',
    back: 'Назад',
    help: 'Помощь',
    cancel: 'Отмена',
    audio: 'Звук',
    music: 'Музыка',
    theme: 'Тема',
    light: 'Светлая',
    dark: 'Тёмная',
    language: 'Язык',
    english: 'Английский',
    russian: 'Русский',
    on: 'ВКЛ',
    off: 'ВЫКЛ',
    victory: 'Победа!',
    gameOver: 'Игра окончена',
    congratulations: 'Поздравляем! Вы достигли целевого счёта!',
    noMoreMoves: 'Больше нет доступных ходов.',
    finalScore: 'Финальный счёт',
    completionTime: 'Время прохождения',
    totalMoves: 'Всего ходов',
    playAgain: 'Играть снова',
    mainMenu: 'Главное меню',
    viewResults: 'Посмотреть результаты',
    gameResults: 'Результаты игр',
    mode: 'Режим',
    time: 'Время',
    moves: 'Ходы',
    result: 'Результат',
    win: 'Победа',
    loss: 'Поражение',
    close: 'Закрыть',
    noGamesCompleted: 'Игры ещё не завершены',
    selectDigit: 'Выберите цифру',
    selectDigitFrom1To9: 'Выберите цифру от 1 до 9',
    thisDigitWillStart: 'Эта цифра начнёт второй ряд.',
    instructions: 'Инструкция',
    instructionsTitle: 'Инструкция к игре',
    instructionsGoal: 'Цель игры',
    instructionsGoalText:
      'Очистите поле, сопоставляя пары чисел. Победа достигается при наборе 100 очков или удалении всех цифр (если включен режим "Играть до конца").',
    instructionsValidPairs: 'Допустимые пары',
    instructionsValidPairsText:
      '• Одинаковые числа (например, 7 и 7) - 1 очко\n• Сумма до 10 (например, 3 и 7, 4 и 6) - 2 очка\n• Двойная пятёрка (5 и 5) - 3 очка',
    instructionsPairRules: 'Правила соединения пар',
    instructionsPairRulesText:
      '• Смежные ячейки: Числа в соседних по вертикали или горизонтали ячейках всегда можно объединить в пары\n• Одна строка/столбец: Числа в одной строке или столбце могут быть объединены в пары, если ячейки между ними пустые\n• Границы рядов: Последнее число одного ряда может совпадать с первым числом следующего ряда',
    instructionsGameModes: 'Режимы игры',
    instructionsGameModesText:
      '• Классический: Последовательные числа от 1 до 19 (исключая 0), расположенные по порядку\n• Случайный: Числа от 1 до 19 (исключая 0), расположенные в случайном порядке\n• Хаотичный: Ровно 27 случайных чисел, использующих только цифры от 1 до 9\n• Выбор цифры: Выберите цифру (1-9) для начала второго ряда',
    instructionsHelpers: 'Вспомогательные инструменты',
    instructionsHelpersText:
      '• Добавить цифры (10 использований): Добавляет оставшиеся числа в сетку\n• Перемешать (5 использований): Случайным образом переставляет все активные числа\n• Ластик (5 использований): Удаляет любое одно число\n• Назад (без ограничений): Отменяет последнее действие\n• Помощь (без ограничений): Подсвечивает допустимые пары на доске',
    instructionsControls: 'Управление',
    instructionsControlsText:
      '• Сброс: Перезапускает текущую игру\n• Сохранить игру: Сохраняет текущее состояние игры\n• Продолжить игру: Загружает ранее сохраненную игру\n• Настройки: Звук, музыка, тема и язык',
    instructionsWinConditions: 'Условия победы',
    instructionsWinConditionsText:
      '• Достичь 100 очков (по умолчанию)\n• Удалить все цифры (если включен режим "Играть до конца")',
    instructionsLossConditions: 'Условия поражения',
    instructionsLossConditionsText:
      '• Нет доступных ходов и все вспомогательные инструменты использованы\n• Достигнут лимит сетки в 50 рядов',
  },
};

export class LanguageManager {
  constructor() {
    this.currentLanguage = this.loadLanguage();
  }

  loadLanguage() {
    const saved = localStorage.getItem('pairEmUpLanguage');
    return saved || 'en';
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('pairEmUpLanguage', lang);
      document.documentElement.lang = lang;
      return true;
    }
    return false;
  }

  getLanguage() {
    return this.currentLanguage;
  }

  t(key) {
    return translations[this.currentLanguage]?.[key] || key;
  }

  onChange(callback) {
    this.onChangeCallback = callback;
  }

  notifyChange() {
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }
}

export const languageManager = new LanguageManager();
