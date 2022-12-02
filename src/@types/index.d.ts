import { FileInfo } from '../models/file-info.model';

/* eslint-disable no-unused-vars */
export {};

declare global {
  interface Window {
    baseAPI: {
      sendMsg(channel: string, args?: any): void;
      invoke(channel: string, args?: any): Promise<any>;
      getImageForResizing(): FileInfo;
      sendImage(image: FileInfo): void;
      closePageConfigWindow(): void;
      onWindowClose(clb: Function): FileInfo;
    };
  }
}
