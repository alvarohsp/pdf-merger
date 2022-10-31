import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as pdfUtility from './pdf/pdf-utility';
import path from 'path';

let mainWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    maximizable: false,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // mainWindow.webContents.openDevTools();
};

const changePage = (pageUrl: string) => {
  mainWindow.loadFile(path.join(__dirname, pageUrl));
};

const showMsgBox = (title: string, message: string, type: string) => {
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

const showOpenFiles = async (title: string, message: string) => {
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

const showSaveFile = (
  title: string,
  message: string,
  binary: Uint8Array
) => {
  dialog
    .showSaveDialog({
      message: message,
      title: title,
      filters: [],
    })
    .then((res) => {
      if (!res.canceled && res.filePath) {
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
