/* eslint-disable no-unused-vars */
export {};

declare global {
  interface Window {
    baseAPI: {
      sendMsg(channel: string, args?: any): void;
      invoke(channel: string, args?: any): Promise<any>;
    };
  }

  interface FileBlock extends HTMLElement {
    fileName: string;
    fileSize: string;
    extension: string;
  }
}
