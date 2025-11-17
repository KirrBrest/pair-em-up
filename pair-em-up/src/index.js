import { StartScreen } from './screens/StartScreen.js';
import { ThemeManager } from './utils/ThemeManager.js';

document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();

  const appWrapper = document.createElement('div');
  appWrapper.className = 'app-wrapper';
  document.body.appendChild(appWrapper);

  new StartScreen();
});
