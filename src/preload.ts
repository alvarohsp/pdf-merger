// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge, shell } from 'electron';

contextBridge.exposeInMainWorld('baseAPI', {
  sendMsg: (channel: string, args: any = undefined) => {
    ipcRenderer.send(channel, args);
  },
});
