export function onClickMergeBtn(): void {
  window.baseAPI.sendMsg('mergeButton', './pages/merger/merger.html');
}

export function openLinkGithub(): void {
  window.baseAPI.sendMsg(
    'openExShell',
    'https://github.com/alvarohsp'
  );
}

// export class WindowHeader extends HTMLElement {
//   constructor() {
//     super();

//     const divTop = document.createElement('div');
//     divTop.classList.add('top-window');
//     this.appendChild(divTop);
//   }
//   connectedCallback() {}
// }

// customElements.define('window-header', WindowHeader);
