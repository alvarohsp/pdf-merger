import { PDFDocument, PDFPage } from 'pdf-lib';
import fs from 'fs';
import { DocumentFile } from '../models/document-file.model';
import { FileInfo } from '../models/file-info.model';
import {
  FileExtensionEnum,
  getFileExtesionByUrl,
} from '../enums/file-extension.enum';
import { ImageProperties } from '../models/image-properties.model';

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

      if (document.extension === FileExtensionEnum.PDF) {
        const copiedPages = await this.copyPdfPages(
          documentFile,
          mergedPdf
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else if (document.extension === FileExtensionEnum.PNG) {
        const pngImage = await mergedPdf.embedPng(
          documentFile.buffer
        );

        const properties = await this.getDefaultImageProperties(
          document
        );

        const pagePng = mergedPdf.addPage();
        pagePng.drawImage(pngImage, {
          x: properties.x,
          y: properties.y,
          width: properties.w,
          height: properties.h,
        });
      } else if (document.extension === FileExtensionEnum.JPG) {
        const jpgImage = await mergedPdf.embedJpg(
          documentFile.buffer
        );

        const properties = await this.getDefaultImageProperties(
          document
        );

        const pageJpg = mergedPdf.addPage();
        pageJpg.drawImage(jpgImage, {
          x: properties.x,
          y: properties.y,
          width: properties.w,
          height: properties.h,
        });
      }
    }

    return await mergedPdf.save();
  }

  private static async loadFile(url: string): Promise<DocumentFile> {
    if (getFileExtesionByUrl(url) === FileExtensionEnum.PDF) {
      return new DocumentFile(
        await PDFDocument.load(fs.readFileSync(url)),
        getFileExtesionByUrl(url)
      );
    } else {
      return new DocumentFile(
        fs.readFileSync(url),
        getFileExtesionByUrl(url)
      );
    }
  }

  private static async getDefaultImageProperties(
    file: FileInfo
  ): Promise<ImageProperties> {
    return new ImageProperties(file);
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
