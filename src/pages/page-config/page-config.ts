import { FileInfo } from '../../models/file-info.model';

const imageElement = document.getElementById(
  'image-edit'
) as HTMLImageElement;

let imageForEditing: FileInfo;

let imageDiv = document.getElementById('dv-image-edit');
let pageW = 297;
let pageH = 421;

let mouseX: number;
let mouseY: number;
let offset = [0, 0];
let isDown = false;

let finalConfig: {
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

function loadImageSize(image: FileInfo): void {
  let tempImgW = image.width / 2;
  let tempImgH = image.height / 2;

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
  centralizeImage();
  setTimeout(() => {
    updateFinalValues();
  }, 120);
}

function centralizeImage(): void {
  imageDiv.style.left = `${
    pageW / 2 - imageElement.width / 2 + 122
  }px`;
  imageDiv.style.top = `${
    pageH / 2 - imageElement.height / 2 + 143
  }px`;
}

function updateFinalValues(): void {
  finalConfig = {
    x:
      Number(
        imageDiv.style.left.substring(
          0,
          imageDiv.style.left.length - 2
        )
      ) - 122,
    y:
      634 -
      Number(
        imageDiv.style.top.substring(0, imageDiv.style.top.length - 2)
      ) -
      63 -
      (imageElement.height + 7),
    height: imageElement.height,
    width: imageElement.width,
  };
  console.log('FINAL CONFIGS...', finalConfig);
}

imageDiv.addEventListener(
  'mousedown',
  function (event: MouseEvent) {
    isDown = true;
    offset = [
      imageDiv.offsetLeft - event.clientX,
      imageDiv.offsetTop - event.clientY,
    ];
  },
  true
);

document.addEventListener(
  'mouseup',
  function () {
    isDown = false;
    updateFinalValues();
  },
  true
);

document.addEventListener(
  'mousemove',
  function (event: MouseEvent) {
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
    }
  },
  true
);

export function onClickOkBtn() {
  imageForEditing.customProps = true;
  imageForEditing.height = finalConfig.height * 2;
  imageForEditing.width = finalConfig.width * 2;
  imageForEditing.xPos = finalConfig.x * 2;
  imageForEditing.yPos = finalConfig.y * 2;

  window.baseAPI.sendImage(imageForEditing);
  window.baseAPI.closePageConfigWindow();
}

export function onClickCancelBtn() {
  window.baseAPI.closePageConfigWindow();
}
