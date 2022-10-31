import { PDFDocument, PDFPage } from 'pdf-lib';
import fs from 'fs';
import { DocumentFile } from '../models/document-file.model';

export async function mergePdf(
  urlArray: string[]
): Promise<Uint8Array> {
  try {
    return await mergeFiles(urlArray);
  } catch (err) {
    throw new Error(`Erro.. ${err}`);
  }
}

export async function saveFile(
  url: string,
  binary: Uint8Array
): Promise<void> {
  const finalUrl = url.endsWith('.pdf') ? url : `${url}.pdf`;
  fs.writeFileSync(finalUrl, binary);
}

async function mergeFiles(urlArray: string[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (let document of urlArray) {
    let documentFile = await loadFile(document);

    switch (documentFile.ext) {
      case '.pdf':
        const copiedPages = await copyPdfPages(
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

async function loadFile(url: string): Promise<DocumentFile> {
  if (getExtension(url) === '.pdf') {
    return new DocumentFile(
      await PDFDocument.load(fs.readFileSync(url)),
      getExtension(url)
    );

    // return {
    //   data: await PDFDocument.load(fs.readFileSync(url)),
    //   ext: getExtension(url),
    // };
  } else {
    return new DocumentFile(fs.readFileSync(url), getExtension(url));
    // return {
    //   data: fs.readFileSync(url),
    //   ext: getExtension(url),
    // };
  }
}

async function returnPngEmbed() {}

function getExtension(filename: string) {
  var i = filename.lastIndexOf('.');
  return i < 0 ? '' : filename.substring(i).toLowerCase();
}

async function copyPdfPages(
  document: DocumentFile,
  mergedPdf: PDFDocument
): Promise<PDFPage[]> {
  return await mergedPdf.copyPages(
    document.pdfDoc,
    document.pdfDoc.getPageIndices()
  );
}
