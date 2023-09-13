// noinspection NodeCoreCodingAssistance,DuplicatedCode

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const http = require('http');
const fs = require('fs');
const util = require('util');
const {exec: child} = require("child_process");
const {log} = require("util");
const crypto = require('crypto');

class Status {
  stage;
  status;
  constructor(stage, status) {
    this.stage = stage;
    this.status = status;
  }
}

class ElectronData {
  electron;
  logs;
  status;
  statusFile;
  uuid;

  constructor(electron, logs, status) {
    this.electron = electron;
    this.logs = logs;
    this.status = status;
  }
}

const statuses = {};
const electronData = initElectronPath();

initMetaheuristicStatusFile();

const log_file = redirectStdout();

// this call of console must be after calling redirectStdout()
console.log("Metaheuristic front-end was started at " + new Date());

startUIServer();

startMetaheuristicServer();

let mainWindow;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  mainWindow = createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })

  // You can use 'before-quit' instead of (or with) the close event
  app.on('before-quit', function (e) {
    // Handle menu-item or keyboard shortcut quit here
    mh_shutdown();
  });

  app.on('activate-with-no-open-windows', function(){
    mainWindow.show();
  });
})

const validStatusFilename = /^mh-[0-9a-zA-Z-]+.status$/;
function initMetaheuristicStatusFile() {
  fs.readdirSync(electronData.status).forEach(file => {
    if (validStatusFilename.test(file)) {
      console.log("  found a lost lock file: " + file);
      fs.rmSync(file, {force: true});
    }
  });
  electronData.uuid = crypto.randomUUID();
  electronData.statusFile = 'mh-' + electronData.uuid + '.status';
}

function initElectronPath() {
  const userHomePath = app.getPath('home');
  const metaheuristicPath = path.join(userHomePath, '.metaheuristic');
  const electronPath = path.join(metaheuristicPath, 'electron');

  if (!fs.existsSync(electronPath)) {
    fs.mkdirSync(electronPath, {recursive: true});
  }
  const logPath = path.join(electronPath, 'logs');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, {recursive: true});
  }
  const statusPath = path.join(metaheuristicPath, 'status');
  if (!fs.existsSync(statusPath)) {
    fs.mkdirSync(statusPath, {recursive: true});
  }

  return new ElectronData(electronPath, logPath, statusPath);
}

function redirectStdout() {
  const log_file = fs.createWriteStream(path.join(electronData.logs, 'console.log'), {flags: 'a'});
  const log_stdout = process.stdout;

  console.log = function (d) {
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
  };
  return log_file;
}

function createWindow () {
  // Window Customization - https://www.electronjs.org/docs/latest/tutorial/window-customization
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    titleBarStyle: 'hidden',
    fullscreen: true,
    // width: 800,
    // height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: true,
      enableRemoteModule: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'mh-angular', 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  return mainWindow;
}

function handleCommands(req, res) {
  const url = req.url;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain')

  switch(url) {
    case "/ping": {
      res.end("Front-end is alive.")
      break;
    }
    case "/status": {
      console.log(""+req.method+" "+ url + " " + req.headers);
      const currStatuses = JSON.stringify(statuses);
      console.log("statuses: " + currStatuses);
      res.end(currStatuses)
      break;
    }
    default: {
      console.log("Not supported url: " + url);
      break;
    }
  }
}

function startUIServer() {
  const port = 64968;

  try {
    const hostname = 'localhost';
// Creating Server
    console.log(`Start preparing a Server for starting at http://${hostname}:${port}/`);
    const server = http.createServer(
        (req, res) => handleCommands(req, res)
    );

// Making the server to listen to required
// hostname and port number
    server.listen(port, hostname, () => {
      // Callback
      console.log(`Server is running at http://${hostname}:${port}/`);
    });
  } catch (e) {
    console.log(e);
  }
}

function startMetaheuristicServer() {
  try {
    // spawn('"with spaces.cmd"', ['arg with spaces'], { shell: true });
    // const childSpawn = require('child_process').spawn;
    const child = require('child_process').exec;
    let executablePath = '"' + path.join(__dirname, 'metaheuristic', 'metaheuristic.exe') + '" uuid='+electronData.uuid;
    console.log("Metaheuristic executablePath: " + executablePath);

    child(executablePath, function (err, data) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data.toString());
    });
  } catch (e) {
    console.log(e);
  }
}

function mh_shutdown() {
  console.log("Metaheuristic was shutdown at "+ new Date());

  try {
    (async () => {
      try {
        //
        // const response = await fetch('http://example.com')
        // const json = await response.json()
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 2000);
        console.log('Request Metaheuristic server to shutdown ...');
        const response = await fetch('http://localhost:64967/rest/v1/standalone/anon/shutdown', {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(id);
        const strResponse = await response.text();
        console.log('Response from Metaheuristic server:\n'+ strResponse);

        log_file.end("\n");
      } catch (error) {
        console.log(error);
      }
    })();
  }
  catch(e) {
    console.log(e);
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  app.quit();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
