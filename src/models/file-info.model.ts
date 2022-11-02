import {
  FileExtensionEnum,
  getFileExtesionByUrl,
} from '../enums/file-extension.enum';

export class FileInfo {
  name: string;
  url: string;
  size: string;
  extension: FileExtensionEnum;

  constructor(url: string, size: number) {
    this.name = /(.*)(\\|\/)(.*\.\w{3})/.exec(url)[3];
    this.url = url;
    this.extension = getFileExtesionByUrl(url);
    this.size =
      size <= 970000
        ? `${Math.round(size / 1024)}kb`
        : `${Math.round(size / (1024 * 1000))}mb`;
  }
}
