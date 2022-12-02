import PDFDocument from 'pdf-lib/cjs/api/PDFDocument';
import { FileExtensionEnum } from '../enums/file-extension.enum';

export class DocumentFile {
  buffer!: Uint8Array;
  pdfDoc!: PDFDocument;

  constructor(
    data: Buffer | Uint8Array | PDFDocument | ArrayBuffer,
    ext: string
  ) {
    if (ext === FileExtensionEnum.PDF) {
      this.pdfDoc = data as PDFDocument;
    } else {
      this.buffer = data as Uint8Array;
    }
  }
}
