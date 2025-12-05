import { StartScreen } from './screens/StartScreen.js';
import { ThemeManager } from './utils/ThemeManager.js';
import { languageManager } from './utils/LanguageManager.js';

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  document.documentElement.lang = languageManager.getLanguage();

  const appWrapper = document.createElement('div');
  appWrapper.className = 'app-wrapper';
  document.body.appendChild(appWrapper);

  new StartScreen();
});
