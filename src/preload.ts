import { ipcRenderer, contextBridge } from 'electron';
import { FileInfo } from './models/file-info.model';

let imageForEditing: FileInfo;

contextBridge.exposeInMainWorld('baseAPI', {
  sendMsg: (channel: string, args: any = undefined): void => {
    ipcRenderer.send(channel, args);
  },
  invoke: (channel: string, args: any = undefined): Promise<any> => {
    return ipcRenderer.invoke(channel, args);
  },

  onWindowClose: (clb: Function): void => {
    ipcRenderer.on('return-file', (event, args) => {
      clb(args);
    });
  },

  getImageForResizing: (): FileInfo => {
    return imageForEditing;
  },

  sendImage: (image: FileInfo): void => {
    ipcRenderer.send('transfer-file', image);
  },

  closePageConfigWindow: (): void => {
    ipcRenderer.send('close-edit-window');
  },
});

ipcRenderer.on('pageEdit', (event, args: FileInfo) => {
  imageForEditing = args;
});
