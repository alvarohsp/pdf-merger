import { FileInfo } from './file-info.model';

export class ImageProperties {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(file: FileInfo) {
    if (file.customProps) {
      this.w = file.width * 2;
      this.h = file.height * 2;
      this.x = this.initXPos(file.xPos) * 2;
      this.y = this.initYPos(file.yPos) * 2;
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

  private initXPos(originalX: number): number {
    const result = originalX - 122;
    return result > 0 ? result + 1 : 0;
  }

  private initYPos(originalY: number): number {
    const result = 634 - originalY - 63 - (this.h / 2 + 7);
    return result;
  }
}
