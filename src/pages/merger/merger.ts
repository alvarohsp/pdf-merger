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
      hideShowButtons(true);
    }
    updateView();
  });
}

function updateView(): void {
  if (fileList.length === 0) {
    clearFileList();
    return;
  }
  clearFileListElement();
  fileList.forEach((element, index) => {
    drawFile(element, index);
  });
}

function drawFile(element: FileInfo, index: number): void {
  const fileElement = document.createElement('file-block');
  fileElement.setAttribute('fileName', element.name);
  fileElement.setAttribute('fileSize', element.size);
  fileElement.setAttribute('extension', element.extension);
  fileElement.setAttribute(
    'last',
    `${index === fileList.length - 1}`
  );
  fileElement.setAttribute('index-pos', `${index}`);
  fileElement.setAttribute(
    'delete-clb',
    `${callbackDeleteFile.name}`
  );
  fileElement.setAttribute(
    'next-clb',
    `${callbackNextPosition.name}`
  );
  fileElement.setAttribute(
    'back-clb',
    `${callbackPreviousPosition.name}`
  );

  fileListElement.appendChild(fileElement);
}

function callbackDeleteFile(position: string): void {
  const numericPosition = Number(position);

  fileList.splice(numericPosition, 1);

  updateView();
}

function callbackNextPosition(position: string): void {
  const numericPos = Number(position);

  [fileList[numericPos], fileList[numericPos + 1]] = [
    fileList[numericPos + 1],
    fileList[numericPos],
  ];

  updateView();
}

function callbackPreviousPosition(position: string): void {
  const numericPos = Number(position);

  [fileList[numericPos - 1], fileList[numericPos]] = [
    fileList[numericPos],
    fileList[numericPos - 1],
  ];

  updateView();
}

function clearFileListElement(): void {
  fileListElement.innerHTML = '';
}

function clearFileList(): void {
  fileList = [];
  clearFileListElement();
  hideShowButtons(false);
}

function hideShowButtons(show: boolean): void {
  if (show) {
    clearListElement.classList.remove('hide');
    saveListElement.classList.remove('hide');
  } else {
    clearListElement.classList.add('hide');
    saveListElement.classList.add('hide');
  }
}

export function saveFileList(): void {
  window.baseAPI.sendMsg('mergeFilesAndSave', fileList);
  setTimeout(() => {
    clearFileList();
  }, 250);
}
