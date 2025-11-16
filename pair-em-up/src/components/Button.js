export class Button {
  constructor(options = {}) {
    this.text = options.text || '';
    this.onClick = options.onClick || null;
    this.className = options.className || '';
    this.disabled = options.disabled || false;
    this.attributes = options.attributes || {};
  }

  create() {
    const button = document.createElement('button');
    button.textContent = this.text;

    if (this.className) {
      button.className = this.className;
    }

    if (this.disabled) {
      button.disabled = true;
    }

    if (this.onClick && !this.disabled) {
      button.addEventListener('click', this.onClick);
    }

    Object.keys(this.attributes).forEach((key) => {
      button.setAttribute(key, this.attributes[key]);
    });

    return button;
  }

  static create(options) {
    return new Button(options).create();
  }
}
