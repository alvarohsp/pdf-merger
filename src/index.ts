import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import * as pdfUtility from './pdf/pdf-utility';
import path from 'path';

let mainWindow: BrowserWindow;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 720,
    maximizable: true,
    resizable: false,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 40,
    },
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.removeMenu();
  mainWindow.webContents.openDevTools();
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

ipcMain.on('openExShell', (event, args: string) => {
  shell.openExternal(args);
});
