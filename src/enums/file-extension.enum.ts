export enum FileExtensionEnum {
  PDF = 'pdf',
  JPG = 'jpg',
  PNG = 'png',
}

export function getFileExtesionByUrl(url: string): FileExtensionEnum {
  const lastDotIndex = url.lastIndexOf('.');
  const ext = url.substring(lastDotIndex + 1).toLowerCase();

  switch (ext) {
    case 'pdf':
      return FileExtensionEnum.PDF;
    case 'jpg':
      return FileExtensionEnum.JPG;
    case 'png':
      return FileExtensionEnum.PNG;
  }
}
