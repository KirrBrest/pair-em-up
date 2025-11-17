export class ResultsManager {
  static saveResult(result) {
    const results = this.getResults();
    results.push(result);
    results.sort((a, b) => {
      const timeA = this.parseTime(a.completionTime);
      const timeB = this.parseTime(b.completionTime);
      return timeA - timeB;
    });

    if (results.length > 5) {
      results.pop();
    }

    localStorage.setItem('pairEmUpResults', JSON.stringify(results));
  }

  static getResults() {
    const saved = localStorage.getItem('pairEmUpResults');
    return saved ? JSON.parse(saved) : [];
  }

  static parseTime(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
