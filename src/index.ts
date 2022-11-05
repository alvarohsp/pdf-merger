import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import path from 'path';
import { OpenDialogReturnValue } from 'electron/main';
import { FileInfo } from './models/file-info.model';
import { handleSquirrelEvent } from './handle-squirrel';
import { PdfUtil } from './utils/pdf-utils';

let mainWindow: BrowserWindow;

if (require('electron-squirrel-startup')) {
  app.quit();
}

if (handleSquirrelEvent(app)) {
  console.log('');
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

const showOpenFiles = async (
  title: string,
  message: string
): Promise<OpenDialogReturnValue> => {
  return dialog.showOpenDialog({
    defaultPath: './',
    message: message,
    title: title,
    filters: [
      {
        extensions: ['pdf', 'png', 'jpg'],
        name: 'All Supported Formats',
      },
      {
        extensions: ['pdf'],
        name: 'Documents',
      },
      {
        extensions: ['png', 'jpg'],
        name: 'Images',
      },
    ],
    properties: ['multiSelections', 'openFile'],
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
      filters: [
        {
          extensions: ['pdf'],
          name: 'PDF Document',
        },
      ],
    })
    .then((res) => {
      if (!res.canceled && res.filePath) {
        PdfUtil.saveFile(res.filePath, binary).then(() => {
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

ipcMain.on('browseButton', () => {
  showOpenFiles('Selecione os arquivos:', 'Selecione os arquivos');
});

ipcMain.on('openExShell', (event, args: string) => {
  shell.openExternal(args);
});

ipcMain.on('mergeFilesAndSave', async (event, args: FileInfo[]) => {
  const binary = await PdfUtil.mergePdf(args);
  showSaveFile('Salvar como', 'Salvar como', binary);
});

ipcMain.handle('browseFiles', async () => {
  const filesSelected = await showOpenFiles(
    'Selecione os arquivos:',
    'Selecione os arquivos'
  );
  if (!filesSelected.canceled) {
    return await PdfUtil.getFilesInfo(filesSelected.filePaths);
  }
});
