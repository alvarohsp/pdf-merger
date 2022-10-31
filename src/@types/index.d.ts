export {};

declare global {
  interface Window {
    baseAPI: {
      sendMsg(channel: string, args?: any): void;
    };
  }
}
