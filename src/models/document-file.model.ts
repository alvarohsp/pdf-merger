import PDFDocument from 'pdf-lib/cjs/api/PDFDocument';

export class DocumentFile {
  buffer!: Uint8Array;
  pdfDoc!: PDFDocument;
  ext: string;

  constructor(
    data: Buffer | Uint8Array | PDFDocument | ArrayBuffer,
    ext: string
  ) {
    if (ext === '.pdf') {
      this.pdfDoc = data as PDFDocument;
    } else {
      this.buffer = data as Uint8Array;
    }
    this.ext = ext;
  }
}
