import { FileInfo } from '../../models/file-info.model';

var fileList: FileInfo[];
var fileListElement: HTMLDivElement;
var clearListElement: HTMLDivElement;
var saveListElement: HTMLDivElement;

export function onInit(): void {
  fileList = [];
  fileListElement = document.querySelector('#files-margin');
  clearListElement = document.querySelector('#clear-file-btn');
  saveListElement = document.querySelector('#save-file-btn');
}

export function onClickBrowse(): void {
  window.baseAPI.invoke('browseFiles').then((res: FileInfo[]) => {
    if (res?.length > 0) {
      fileList.push(...res);
      clearListElement.classList.remove('hide');
      saveListElement.classList.remove('hide');
    }
    updateView();
  });
}

function updateView(): void {
  clearFileListElement();
  fileList.forEach((element) => {
    drawFile(element);
  });
}

function drawFile(element: FileInfo): void {
  const fileElement = document.createElement('div');
  fileElement.classList.add('file-block');
  const svgElement = document.createElement('svg');
  svgElement.setAttribute('width', '64');
  svgElement.setAttribute('height', '64');

  const imageElement = document.createElement('img');
  imageElement.src = getImageByExtension(element.extension);

  imageElement.setAttribute('height', '64');
  imageElement.setAttribute('width', '64');

  svgElement.appendChild(imageElement);
  fileElement.appendChild(svgElement);

  const fileInfoElement = document.createElement('div');
  fileInfoElement.classList.add('file-info');
  const fileNameElement = document.createElement('p');
  fileNameElement.classList.add('file-name');
  fileNameElement.innerText = element.name;

  const fileSizeElement = document.createElement('p');
  fileSizeElement.classList.add('file-size');
  fileSizeElement.innerText = element.size;

  fileInfoElement.appendChild(fileNameElement);
  fileInfoElement.appendChild(fileSizeElement);

  fileElement.appendChild(fileInfoElement);

  fileListElement.appendChild(fileElement);
}

function getImageByExtension(extension: string): string {
  switch (extension) {
    case 'pdf':
      return '../../assets/svg/pdf_file_icon.svg';

    case 'jpg':
      return '../../assets/svg/jpg_file_icon.svg';

    case 'png':
      return '../../assets/svg/png_file_icon.svg';
  }
}

function clearFileListElement(): void {
  fileListElement.innerHTML = '';
}

export function clearFileList(): void {
  fileList = [];
  clearFileListElement();
  clearListElement.classList.add('hide');
  saveListElement.classList.add('hide');
}

export function saveFileList(): void {
  window.baseAPI.sendMsg('mergeFilesAndSave', fileList);
  setTimeout(() => {
    clearFileList();
  }, 250);
}
