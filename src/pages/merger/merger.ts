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
  const fileElement = document.createElement('file-block');
  fileElement.setAttribute('fileName', element.name);
  fileElement.setAttribute('fileSize', element.size);
  fileElement.setAttribute('extension', element.extension);

  fileListElement.appendChild(fileElement);
}

function clearFileListElement(): void {
  fileListElement.innerHTML = '';
}

function clearFileList(): void {
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
