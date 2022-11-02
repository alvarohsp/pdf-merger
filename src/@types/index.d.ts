export {};

declare global {
  interface Window {
    baseAPI: {
      sendMsg(channel: string, args?: any): void;
      invoke(channel: string, args?: any): Promise<any>;
    };
  }
}
