class WindowHeader extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const divTop = document.createElement('div');
    divTop.classList.add('top-window');
    this.appendChild(divTop);
  }
}

customElements.define('window-header', WindowHeader);
