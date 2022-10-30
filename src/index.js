const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const pdfUtility = require('./pdf/pdf-utility');
const path = require('path');

let mainWindow = undefined;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    maximizable: false,
    // resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // mainWindow.webContents.openDevTools();
};

const changePage = (pageUrl) => {
  mainWindow.loadFile(path.join(__dirname, pageUrl));
};

const showMsgBox = (title, message, type) => {
  dialog
    .showMessageBox({
      type: type,
      message: message,
      title: title,
    })
    .then((res) => {
      console.log(res);
    });
};

const showOpenFiles = async (title, message) => {
  dialog
    .showOpenDialog({
      defaultPath: './',
      message: message,
      title: title,
      properties: ['multiSelections', 'openFile'],
    })
    .then((res) => {
      console.log(res);
      if (!res.canceled) {
        pdfUtility
          .mergePdf(res.filePaths)
          .then((res) =>
            showSaveFile('Salvar como', 'Salvar como', res)
          );
      }
    });
};

const showSaveFile = (title, message, binary) => {
  dialog
    .showSaveDialog({
      message: message,
      title: title,
      filters: [],
    })
    .then((res) => {
      if (!res.canceled) {
        pdfUtility.saveFile(res.filePath, binary).then(() => {
          showMsgBox('Sucesso', 'Arquivo salvo com sucesso!', 'info');
        });
      }
      console.log(res);
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('mergeButton', (event, args) => {
  changePage(args);
});

ipcMain.on('browseButton', (event, args) => {
  showOpenFiles('Selecione os arquivos:', 'Selecione os arquivos');
});

ipcMain.on('saveFile', (event, args) => {
  showSaveFile('Salvar como', 'Salvar como', args);
});
