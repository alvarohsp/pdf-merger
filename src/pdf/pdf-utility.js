const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

module.exports = {
  mergePdf: async (urlArray) => {
    try {
      return await mergeFiles(urlArray);
    } catch (err) {
      console.log(err);
    }
  },
  saveFile: async (url, binary) => {
    const finalUrl = url.endsWith('.pdf') ? url : `${url}.pdf`;

    fs.writeFileSync(finalUrl, binary);
  },
};

async function mergeFiles(urlArray) {
  const mergedPdf = await PDFDocument.create();

  for (let document of urlArray) {
    document = await loadFile(document);

    switch (document.ext) {
      case '.pdf':
        const copiedPages = await copyPdfPages(document, mergedPdf);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        break;
      case '.png':
        const pngImage = await mergedPdf.embedPng(document.data);
        const pagePng = mergedPdf.addPage();
        pagePng.drawImage(pngImage, {
          x: 14,
          y: 12,
          width: pagePng.getWidth() / 1.04,
          height: pagePng.getHeight() / 1.04,
        });
        break;
      case '.jpg':
        const jpgImage = await mergedPdf.embedJpg(document.data);
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

async function loadFile(url) {
  if (getExtension(url) === '.pdf') {
    return {
      data: await PDFDocument.load(fs.readFileSync(url)),
      ext: getExtension(url),
    };
  } else {
    return {
      data: fs.readFileSync(url),
      ext: getExtension(url),
    };
  }
}

async function returnPngEmbed() {}

function getExtension(filename) {
  var i = filename.lastIndexOf('.');
  return i < 0 ? '' : filename.substring(i).toLowerCase();
}

async function copyPdfPages(document, mergedPdf) {
  return await mergedPdf.copyPages(
    document.data,
    document.data.getPageIndices()
  );
}
