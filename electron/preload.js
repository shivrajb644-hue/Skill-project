const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronDesktop', {
  isDesktop: true,
  platform: process.platform,
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path')
});
