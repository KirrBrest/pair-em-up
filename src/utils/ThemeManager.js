export class ThemeManager {
  static init() {
    const savedTheme = localStorage.getItem('pairEmUpTheme') || 'light';
    this.applyTheme(savedTheme);
  }

  static getCurrentTheme() {
    return localStorage.getItem('pairEmUpTheme') || 'light';
  }

  static toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem('pairEmUpTheme', newTheme);
    return newTheme;
  }

  static applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
    localStorage.setItem('pairEmUpTheme', theme);
  }
}
