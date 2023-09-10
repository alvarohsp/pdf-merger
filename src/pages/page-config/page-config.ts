import { FileInfo } from '../../models/file-info.model';

const imageElement = document.getElementById(
  'image-edit'
) as HTMLImageElement;

let imageForEditing: FileInfo;

let imageDiv = document.getElementById('dv-image-edit');
let inputX = document.getElementById('input-x') as HTMLInputElement;
let inputY = document.getElementById('input-y') as HTMLInputElement;
let inputW = document.getElementById('input-w') as HTMLInputElement;
let inputH = document.getElementById('input-h') as HTMLInputElement;

let pageW = 297;
let pageH = 421;

let mouseX: number;
let mouseY: number;
let offset = [0, 0];
let isDown = false;

let configs: {
  x: number;
  y: number;
  height: number;
  width: number;
};

export function onInit(): void {
  imageForEditing = window.baseAPI.getImageForResizing();

  loadImage(imageForEditing);
}

function loadImage(image: FileInfo): void {
  imageElement.src = image.url;
  loadImageSize(image);
}

function setInputX(x: number): void {
  inputX.value = `${formatXValueForInput(x)}`;
}

function setInputY(y: number): void {
  inputY.value = `${formatYValueForInput(y)}`;
}

function setInputW(w: number): void {
  inputW.value = `${w * 2}`;
}

function setInputH(h: number): void {
  inputH.value = `${h * 2}`;
}

function getInputW(): number {
  return Number(inputW.value) / 2;
}

function getInputH(): number {
  return Number(inputH.value) / 2;
}

function formatXValueForInput(x: number): number {
  return (x - 122) * 2;
}

function revertXValueForInput(x: number): number {
  return x / 2 + 122;
}

function revertYValueForInput(y: number): number {
  const yT = y / 2;
  return 634 - yT - 63 - (imageElement.height + 7);
}

function formatYValueForInput(y: number): number {
  const result = 634 - y - 63 - (imageElement.height + 7);
  return result * 2;
}

export function applyXPos(): void {
  const num = filterXLimit(
    revertXValueForInput(Number(inputX.value))
  );
  imageDiv.style.left = `${num}px`;
}

export function applyYPos(): void {
  const num = filterYLimit(
    revertYValueForInput(Number(inputY.value))
  );
  imageDiv.style.top = `${num}px`;
}

export function applyWSize(): void {
  imageElement.width = filterWLimit(getInputW());
}

export function applyHSize(): void {
  imageElement.height = filterHLimit(getInputH());
}

export function onEnterKey(event: KeyboardEvent): void {
  if (event?.key === 'Enter') {
    applyXPos();
    applyYPos();
    applyHSize();
    applyWSize();
  }
}

function filterHLimit(value: number): number {
  const minLimit = 5;
  const maxLimit = pageH;

  if (value < minLimit) {
    setInputH(minLimit);
    return minLimit;
  } else if (value > maxLimit) {
    setInputH(maxLimit);
    imageDiv.style.top = `143px`;

    return maxLimit;
  }

  return value;
}

function filterWLimit(value: number): number {
  const minLimit = 5;
  const maxLimit = pageW;

  if (value < minLimit) {
    setInputW(minLimit);
    return minLimit;
  } else if (value > maxLimit) {
    setInputW(maxLimit);
    imageDiv.style.left = `122px`;

    return maxLimit;
  }

  return value;
}

function filterXLimit(value: number) {
  const minLimit = 122;
  const maxLimit = minLimit + pageW - imageElement.width;

  if (value > maxLimit) {
    setInputX(maxLimit);
    return maxLimit;
  } else if (value < minLimit) {
    setInputX(minLimit);
    return minLimit;
  }

  return value;
}

function filterYLimit(value: number) {
  const minLimit = 143;
  const maxLimit = minLimit + pageH - imageElement.height;

  if (value > maxLimit) {
    setInputY(maxLimit);
    return maxLimit;
  } else if (value < minLimit) {
    setInputY(minLimit);
    return minLimit;
  }

  return value;
}

function loadImageSize(image: FileInfo): void {
  if (image.customProps) {
    imageElement.width = image.width;
    imageElement.height = image.height;
    imageDiv.style.left = `${image.xPos}px`;
    imageDiv.style.top = `${image.yPos}px`;
    setInputX(image.xPos);
    setInputY(image.yPos);
    setInputW(image.width);
    setInputH(image.height);
    return;
  }
  let tempImgW = image.originalWidth / 2;
  let tempImgH = image.originalHeight / 2;

  const fixedPercentW = (tempImgW * 2.5) / 100;
  const fixedPercentH = (tempImgH * 2.5) / 100;

  for (let round = 0; round <= 40; round++) {
    if (tempImgW >= pageW || tempImgH >= pageH) {
      tempImgH -= fixedPercentH;
      tempImgW -= fixedPercentW;
    } else {
      break;
    }
  }
  imageElement.width = tempImgW;
  imageElement.height = tempImgH;
  setInputW(tempImgW);
  setInputH(tempImgH);
  centralizeImage();
  setTimeout(() => {
    updateFinalValues();
  }, 120);
}

export function centralizeImage(): void {
  const leftPos = pageW / 2 - imageElement.width / 2 + 122;
  const topPos = pageH / 2 - imageElement.height / 2 + 143;
  imageDiv.style.left = `${leftPos}px`;
  imageDiv.style.top = `${topPos}px`;
  setInputX(leftPos);
  setInputY(topPos);
}

export function resetImage(): void {
  imageForEditing.customProps = false;
  loadImageSize(imageForEditing);
}

export function stretchImage(): void {
  imageElement.height = pageH;
  imageElement.width = pageW;
  setInputH(imageElement.height);
  setInputW(imageElement.width);
  centralizeImage();
}

function updateFinalValues(): void {
  configs = {
    x: Number(
      imageDiv.style.left.substring(0, imageDiv.style.left.length - 2)
    ),
    y: Number(
      imageDiv.style.top.substring(0, imageDiv.style.top.length - 2)
    ),
    height: imageElement.height,
    width: imageElement.width,
  };
}

imageDiv.addEventListener('mousedown', (event: MouseEvent) => {
  isDown = true;
  offset = [
    imageDiv.offsetLeft - event.clientX,
    imageDiv.offsetTop - event.clientY,
  ];
});

document.addEventListener('mouseup', () => {
  isDown = false;
  updateFinalValues();
});

document.addEventListener('mousemove', (event: MouseEvent) => {
  event.preventDefault();
  if (isDown) {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (mouseX + offset[0] < 122) {
      imageDiv.style.left = '122px';
    } else if (
      mouseX + offset[0] >
      122 + (pageW - imageElement.width)
    ) {
      imageDiv.style.left = `${122 + pageW - imageElement.width}px`;
    } else {
      imageDiv.style.left = mouseX + offset[0] + 'px';
    }

    if (mouseY + offset[1] < 143) {
      imageDiv.style.top = '143px';
    } else if (
      mouseY + offset[1] >
      143 + (pageH - imageElement.height)
    ) {
      imageDiv.style.top = `${143 + pageH - imageElement.height}px`;
    } else {
      imageDiv.style.top = mouseY + offset[1] + 'px';
    }

    setInputX(
      Number(
        imageDiv.style.left.substring(
          0,
          imageDiv.style.left.length - 2
        )
      )
    );
    setInputY(
      Number(
        imageDiv.style.top.substring(0, imageDiv.style.top.length - 2)
      )
    );
  }
});

export function onClickOkBtn() {
  imageForEditing.customProps = true;
  imageForEditing.height = configs.height;
  imageForEditing.width = configs.width;

  imageForEditing.xPos = configs.x;
  imageForEditing.yPos = configs.y;

  window.baseAPI.sendImage(imageForEditing);
  window.baseAPI.closePageConfigWindow();
}

export function onClickCancelBtn() {
  window.baseAPI.closePageConfigWindow();
}
