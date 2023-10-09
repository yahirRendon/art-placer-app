/**
 * main process as backend. 
 */
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain, ipcRenderer, dialog} = require('electron');
const fs = require('fs');
const { shell } = require('electron') // deconstructing assignment

const isDev = process.env.NODE_ENV !== 'development';
const isMac = process.platform === 'darwin'; // win32, linux
let mainWindow;

/**
 * create the main window
 */
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "art placer app",
        width: isDev ? 1600 : 1400,
        height: 1000,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        },
        frame: false,
        autoHideMenuBar: true,
        // icon: "renderer/images/icons/icon.png"
    });

    // open dev tools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/html/index.html'));
}

/**
 * create the main window when able to
 */
app.whenReady().then(() => {
    createMainWindow();

    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

/**
 * quite the app when all windows are closed
 */
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

/**
 * minimize the main window
 */
ipcMain.on('minimize-window', () => {
    mainWindow.minimize()
});
/**
 * close the application
 */
ipcMain.on('close-window', () => {
    app.quit();
});

/**
 * select file
 */
ipcMain.on('show-open-dialog', (event, arg) => {

    const options = {
        title: 'Select an image',
        defaultPath: app.getPath('desktop'),
        //buttonLabel: 'Do it',
        /*filters: [
          { name: 'xml', extensions: ['xml'] }
        ],*/
        //properties: ['showHiddenFiles'],
        //message: 'This message will only be shown on macOS'
      };

    dialog.showOpenDialog(null, options, (filePaths) => {
        event.sender.send('open-dialog-paths-selected', filePaths)
      });
})

ipcMain.handle('ping', () => "pong")

ipcMain.handle('dialog:openFile', handleFileOpen)
async function handleFileOpen () {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (!canceled) {
      return filePaths[0]
    }
  }


