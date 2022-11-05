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
    const fileNameElement = document.createElement('p');
    fileNameElement.classList.add('file-name');
    fileNameElement.innerText = this.getAttribute('fileName');

    const fileSizeElement = document.createElement('p');
    fileSizeElement.classList.add('file-size');
    fileSizeElement.innerText = this.getAttribute('fileSize');

    fileInfoElement.appendChild(fileNameElement);
    fileInfoElement.appendChild(fileSizeElement);

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

customElements.define('file-block', FileBlock);
