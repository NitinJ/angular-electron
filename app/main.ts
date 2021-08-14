import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { ChildProcess, spawn, exec } from 'child_process';
var kill  = require('tree-kill');

// Initialize remote module
require('@electron/remote/main').initialize();

let win: BrowserWindow = null;
let siosaBackendChildProcess: ChildProcess = null;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function killBackend() {
  if (siosaBackendChildProcess) {
    exec('taskkill /F /IM source.exe /T', () => {});
    // kill(siosaBackendChildProcess.pid, 'SIGKILL');
  }
}
function spawnBackend() {
  const siosa = spawn('resources/source.exe', {
      detached: false,
      windowsHide: true,
      stdio: 'ignore'
  });
  siosa.on('error', (err) => {
      console.error('Failed to start siosa.');
  });
  siosa.on('spawn', () => {
    console.error('Siosa started !');
  })
  return siosa;
}

function createWindow(): BrowserWindow {
  siosaBackendChildProcess = spawnBackend();
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 768,
    fullscreenable: false,
    title: "Siosa",
    autoHideMenuBar: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      // devTools: (serve) ? true : false,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule : true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    },
  });
  win.setMenuBarVisibility(false);


  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    killBackend();
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
