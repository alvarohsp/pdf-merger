import imageSize from 'image-size';
import {
  FileExtensionEnum,
  getFileExtesionByUrl,
} from '../enums/file-extension.enum';

import { randomUUID } from 'node:crypto';

export class FileInfo {
  id: string;
  name: string;
  url: string;
  size: string;
  extension: FileExtensionEnum;
  width: number;
  height: number;
  customProps: boolean;
  xPos: number;
  yPos: number;

  constructor(url: string, size: number) {
    this.id = randomUUID().substring(24);
    this.name = /(.*)(\\|\/)(.*\.\w{3})/.exec(url)[3];
    this.customProps = false;
    this.url = url;
    this.extension = getFileExtesionByUrl(url);
    this.size =
      size <= 970000
        ? `${Math.round(size / 1024)}kb`
        : `${Math.round(size / (1024 * 1000))}mb`;

    if (this.extension !== FileExtensionEnum.PDF) {
      const dimensions = imageSize(this.url);
      this.width = dimensions.width;
      this.height = dimensions.height;
    }
  }
}
