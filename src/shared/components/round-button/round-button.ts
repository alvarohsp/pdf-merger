class RoundButton extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const divBtn = document.createElement('div');
    divBtn.classList.add('start-btn');
    const pBtn = document.createElement('p');
    pBtn.textContent = this.getAttribute('label');
    divBtn.appendChild(pBtn);

    if (this.getAttribute('hide') === 'true') {
      this.classList.add('hide');
    } else {
      this.classList.remove('hide');
    }

    this.appendChild(divBtn);
  }

  static get observedAttributes() {
    return ['hide'];
  }

  //   attributeChangedCallback(name, oldValue, newValue) {
  // if (name === 'hide') {
  //   if (newValue === 'true') {
  //     this.classList.add('hide');
  //   } else {
  //     this.classList.remove('hide');
  //   }
  // }
  //   }
}

customElements.define('round-button', RoundButton);
