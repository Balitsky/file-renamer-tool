import { app, BrowserWindow, ipcMain } from 'electron';

// update app from github release
require('update-electron-app')()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let chooseLangWindow;

ipcMain.on('resize-window', (e, params) => {
  mainWindow.setMinimumSize(params.width, params.height)
  mainWindow.setSize(params.width, params.height, false);
  e.returnValue = true;
})

ipcMain.on('apply-langs', (e, params) => {
  mainWindow.webContents.send('apply-langs', params.langs)
  e.returnValue = true;
})


ipcMain.on('chooseLang-window', (e, params) => {
  chooseLangWindow = new BrowserWindow({
    parent: mainWindow,
    width: params.width,
    height: params.height,
    transparent: true,
    resizable: false,
    fullscreen: false,
    fullscreenable: false,
    maximizable: false,
    webviewTag: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  var localParams = params
  chooseLangWindow.webContents.once('dom-ready', () => {
    chooseLangWindow.webContents.send('langs-option', localParams) 
  })
  chooseLangWindow.loadFile('src/chooseLangPage.html');
  // chooseLangWindow.webContents.openDevTools();
  
  
  /* setTimeout(() => {
    chooseLangWindow.webContents.send('langs-option', langs)  
  }, 5200) */
  e.returnValue = true;
})

var windowOptions = {
  width: 500,
  height: 200,
  transparent: true,
  resizable: false,
  fullscreen: false,
  fullscreenable: false,
  maximizable: false,
  webviewTag: true,
  frame: false,
  webPreferences: {
    nodeIntegration: true
  }
}

var devOptions = {
  transparent: false,
  resizable: true,
  fullscreenable: true,
  maximizable: true
}

devOptions = undefined;

if (devOptions) {
  windowOptions = {
    width: 500,
    height: 200,
    transparent: false,
    resizable: true,
    fullscreenable: true,
    maximizable: true,
    webviewTag: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  }
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow(windowOptions);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (devOptions) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.