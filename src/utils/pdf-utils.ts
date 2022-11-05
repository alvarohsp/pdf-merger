import { PDFDocument, PDFPage } from 'pdf-lib';
import fs from 'fs';
import { DocumentFile } from '../models/document-file.model';
import { FileInfo } from '../models/file-info.model';

export class PdfUtil {
  public static async getFilesInfo(
    urlArray: string[]
  ): Promise<FileInfo[]> {
    const finalList: FileInfo[] = [];

    for (let file of urlArray) {
      const { size } = fs.statSync(file);
      finalList.push(new FileInfo(file, size));
    }

    return finalList;
  }

  public static async mergePdf(
    filesList: FileInfo[]
  ): Promise<Uint8Array> {
    try {
      return await this.mergeFiles(filesList);
    } catch (err) {
      throw new Error(`Erro.. ${err}`);
    }
  }

  public static async saveFile(
    url: string,
    binary: Uint8Array
  ): Promise<void> {
    const finalUrl = url.endsWith('.pdf') ? url : `${url}.pdf`;
    fs.writeFileSync(finalUrl, binary);
  }

  private static async mergeFiles(
    fileLists: FileInfo[]
  ): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();

    for (let document of fileLists) {
      let documentFile = await this.loadFile(document.url);

      switch (documentFile.ext) {
        case '.pdf':
          const copiedPages = await this.copyPdfPages(
            documentFile,
            mergedPdf
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          break;
        case '.png':
          const pngImage = await mergedPdf.embedPng(
            documentFile.buffer
          );
          const pagePng = mergedPdf.addPage();
          pagePng.drawImage(pngImage, {
            x: 14,
            y: 12,
            width: pagePng.getWidth() / 1.04,
            height: pagePng.getHeight() / 1.04,
          });
          break;
        case '.jpg':
          const jpgImage = await mergedPdf.embedJpg(
            documentFile.buffer
          );
          // const jpgDims = jpgImage.scale(1);
          const pageJpg = mergedPdf.addPage();
          pageJpg.drawImage(jpgImage, {
            x: 14,
            y: 12,
            width: pageJpg.getWidth() / 1.04,
            height: pageJpg.getHeight() / 1.04,
          });
          break;
      }
    }

    return await mergedPdf.save();
  }

  private static async loadFile(url: string): Promise<DocumentFile> {
    if (this.getExtension(url) === '.pdf') {
      return new DocumentFile(
        await PDFDocument.load(fs.readFileSync(url)),
        this.getExtension(url)
      );
    } else {
      return new DocumentFile(
        fs.readFileSync(url),
        this.getExtension(url)
      );
    }
  }

  private static getExtension(filename: string) {
    var i = filename.lastIndexOf('.');
    return i < 0 ? '' : filename.substring(i).toLowerCase();
  }

  private static async copyPdfPages(
    document: DocumentFile,
    mergedPdf: PDFDocument
  ): Promise<PDFPage[]> {
    return await mergedPdf.copyPages(
      document.pdfDoc,
      document.pdfDoc.getPageIndices()
    );
  }
}
