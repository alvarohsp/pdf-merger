// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('baseAPI', {
  sendMsg: (channel: string, args: any = undefined): void => {
    ipcRenderer.send(channel, args);
  },
  invoke: (channel: string, args: any = undefined): Promise<any> => {
    return ipcRenderer.invoke(channel, args);
  },
});
