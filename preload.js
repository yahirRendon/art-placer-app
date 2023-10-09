const { contextBridge, ipcRenderer } = require('electron')

/**
 * create api that connects the main.js and all front end js files (index.js, stats.js, settings.js)
 */
contextBridge.exposeInMainWorld('api', {
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    openDialog: () => ipcRenderer.send('show-open-dialog'),
    ping: () => ipcRenderer.invoke('ping'),

    openFile: () => ipcRenderer.invoke('dialog:openFile')
    

});