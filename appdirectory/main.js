// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

const child = require('child_process').execFile;
const executablePath = path.join(__dirname, 'metaheuristic', 'metaheuristic.exe');

child(executablePath, function(err, data) {
  if(err){
    console.error(err);
    return;
  }
  console.log(data.toString());
});

function createWindow () {
  // Window Customization - https://www.electronjs.org/docs/latest/tutorial/window-customization
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden',
    fullscreen: true,
    // width: 800,
    // height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'mh-angular', 'index.html'))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Continue to handle mainWindow "close" event here
/*
  mainWindow.on('close', function(e){
    if(!force_quit){
      e.preventDefault();
      mainWindow.hide();
    }
  });
*/

  // You can use 'before-quit' instead of (or with) the close event
  app.on('before-quit', function (e) {
    // Handle menu-item or keyboard shortcut quit here
    mh_shutdown();
/*
    if(!force_quit){
      e.preventDefault();
      mainWindow.hide();
    }
*/
  });

  app.on('activate-with-no-open-windows', function(){
    mainWindow.show();
  });
})

function mh_shutdown() {
  //console.log('Request Metaheuristic to shutdown ...');
  const userAction = async () => {
    const response = await fetch('http://localhost:64967/rest/v1/standalone/anon/shutdown', {
      method: 'GET'
    });
    const strResponse = response.json();
    console.log('Response from Metaheuristic: ', strResponse);
  }
  userAction();

}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
