import { StartScreen } from './screens/StartScreen.js';

document.addEventListener('DOMContentLoaded', () => {
  const appWrapper = document.createElement('div');
  appWrapper.className = 'app-wrapper';
  document.body.appendChild(appWrapper);

  new StartScreen();
});
