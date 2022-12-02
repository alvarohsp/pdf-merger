import { FileInfo } from './file-info.model';

export class ImageProperties {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(file: FileInfo) {
    if (file.customProps) {
      this.x = file.xPos > 0 ? file.xPos + 1 : 0;
      this.y = file.yPos;
      this.w = file.width;
      this.h = file.height;
    } else {
      let tempImgW = file.width;
      let tempImgH = file.height;

      const fixedPercentW = (tempImgW * 2.5) / 100;
      const fixedPercentH = (tempImgH * 2.5) / 100;
      for (let i = 0; i <= 40; i++) {
        if (tempImgW >= 595 || tempImgH >= 842) {
          tempImgH -= fixedPercentH;
          tempImgW -= fixedPercentW;
        } else {
          break;
        }
      }
      this.w = tempImgW;
      this.h = tempImgH;
      this.x = 595 / 2 - tempImgW / 2;
      this.y = 842 / 2 - tempImgH / 2;
    }
  }
}
