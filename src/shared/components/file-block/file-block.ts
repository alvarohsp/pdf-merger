class FileBlock extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const fileElement = document.createElement('div');
    fileElement.classList.add('dv-file-block');

    const svgElement = document.createElement('svg');
    svgElement.setAttribute('width', '64');
    svgElement.setAttribute('height', '64');

    const imageElement = document.createElement('img');
    imageElement.src = getImageByExtension(
      this.getAttribute('extension')
    );

    imageElement.setAttribute('height', '64');
    imageElement.setAttribute('width', '64');

    svgElement.appendChild(imageElement);
    fileElement.appendChild(svgElement);

    const fileInfoElement = document.createElement('div');
    fileInfoElement.classList.add('file-info');

    const insideFileInfoElement = document.createElement('div');
    insideFileInfoElement.classList.add('dv-file-group');

    const fileNameElement = document.createElement('p');
    fileNameElement.classList.add('file-name');
    fileNameElement.innerText = this.getAttribute('fileName');

    const fileSizeElement = document.createElement('p');
    fileSizeElement.classList.add('file-size');
    fileSizeElement.innerText = this.getAttribute('fileSize');

    insideFileInfoElement.appendChild(fileNameElement);
    insideFileInfoElement.appendChild(fileSizeElement);

    fileInfoElement.appendChild(insideFileInfoElement);

    const insideFileInfoBtns = document.createElement('div');
    insideFileInfoBtns.classList.add('dv-file-btn');

    //////////////////////////////////////
    // CREATING DELETE BUTTON

    const insideFileInfoBtnBar1 = document.createElement('div');
    insideFileInfoBtnBar1.classList.add('dv-btn-bar');

    const imageBtn1 = document.createElement('img');
    imageBtn1.src = getImageByBtn('cancel');
    imageBtn1.classList.add('p-btn-bar');

    imageBtn1.onclick = () => {
      const arg = this.getAttribute('index-pos');
      const clb = this.getAttribute('delete-clb');
      eval(`${clb}('${arg}')`);
    };

    insideFileInfoBtnBar1.appendChild(imageBtn1);

    insideFileInfoBtns.appendChild(insideFileInfoBtnBar1);

    //////////////////////////////////////
    // CREATING NEXT BUTTON

    if (this.getAttribute('last') === 'false') {
      const insideFileInfoBtnBar2 = document.createElement('div');
      insideFileInfoBtnBar2.classList.add('dv-btn-bar');

      const imageBtn2 = document.createElement('img');
      imageBtn2.src = getImageByBtn('next');
      imageBtn2.classList.add('p-btn-bar');

      imageBtn2.onclick = () => {
        const arg = this.getAttribute('index-pos');
        const clb = this.getAttribute('next-clb');
        eval(`${clb}('${arg}')`);
      };

      insideFileInfoBtnBar2.appendChild(imageBtn2);

      insideFileInfoBtns.appendChild(insideFileInfoBtnBar2);
    }

    //////////////////////////////////////
    // CREATING BACK BUTTON

    if (this.getAttribute('index-pos') !== '0') {
      const insideFileInfoBtnBar3 = document.createElement('div');
      insideFileInfoBtnBar3.classList.add('dv-btn-bar');

      const imageBtn3 = document.createElement('img');
      imageBtn3.src = getImageByBtn('back');
      imageBtn3.classList.add('p-btn-bar');

      imageBtn3.onclick = () => {
        const arg = this.getAttribute('index-pos');
        const clb = this.getAttribute('back-clb');
        eval(`${clb}('${arg}')`);
      };

      insideFileInfoBtnBar3.appendChild(imageBtn3);

      insideFileInfoBtns.appendChild(insideFileInfoBtnBar3);
    }

    fileInfoElement.appendChild(insideFileInfoBtns);

    fileElement.appendChild(fileInfoElement);
    this.appendChild(fileElement);
  }
}

function getImageByExtension(extension: string): string {
  switch (extension) {
    case 'pdf':
      return '../../../src/assets/svg/pdf_file_icon.svg';

    case 'jpg':
      return '../../../src/assets/svg/jpg_file_icon.svg';

    case 'png':
      return '../../../src/assets/svg/png_file_icon.svg';
  }
}

function getImageByBtn(button: string): string {
  switch (button) {
    case 'cancel':
      return '../../../src/assets/button/btn-cancel.png';
    case 'next':
      return '../../../src/assets/button/btn-next.png';
    case 'back':
      return '../../../src/assets/button/btn-back.png';
  }
}

customElements.define('file-block', FileBlock);
