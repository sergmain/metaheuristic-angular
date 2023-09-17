// noinspection NodeCoreCodingAssistance,DuplicatedCode

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const http = require('http');
const fs = require('fs');
const util = require('util');
const {exec: child} = require("child_process");
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
  statusContent = '';

  constructor(electron, logs, status) {
    this.electron = electron;
    this.logs = logs;
    this.status = status;
  }
}

const electronData = initElectronPath();
const validStatusFilename = /^mh-[0-9a-zA-Z-]+.status$/;
const log_file = redirectStdout();

let mainWindow;
let statusFileWatcher;

initMetaheuristicStatusFile();

// this call of console must be after calling redirectStdout()
console.log("Metaheuristic front-end was started at " + new Date());

startUIServer();

startMetaheuristicServer();

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

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    app.quit();
  })

})

function initMetaheuristicStatusFile() {
  electronData.uuid = crypto.randomUUID();
  electronData.statusFile = path.join(electronData.status, 'mh-' + electronData.uuid + '.status');
  console.log("electronData.statusFile: " + electronData.statusFile);
  fs.readdirSync(electronData.status).forEach(file => {
    if (validStatusFilename.test(file)) {
      let fullPath = path.join(electronData.status, file);
      console.log("  found a lost lock file: " + fullPath);
      fs.rmSync(fullPath, {force: true});
    }
  });
  fs.writeFileSync(electronData.statusFile, '', (err) => {
    if (err) {
      console.log("Error while initializing a status file. " + JSON.stringify(err));
    }
  });
  fs.closeSync(fs.openSync(electronData.statusFile, 'w'));

  statusFileWatcher = fs.watchFile(electronData.statusFile,
      {
        // Specify the use of big integers
        // in the Stats object
        bigint: false,

        // Specify if the process should
        // continue as long as file is
        // watched
        persistent: true,

        // Specify the interval between
        // each poll the file
        interval: 1000,
      },
      (curr, prev) => {
        if (fs.existsSync(electronData.statusFile) ) {
          electronData.statusContent = fs.readFileSync(electronData.statusFile);
          // console.log(`${electronData.statusFile} file Changed,\n` + electronData.statusContent);
        }
      });
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
  // mainWindow.webContents.openDevTools()
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
      //console.log(""+req.method+" "+ url + " " + req.headers);
      //console.log("statuses:\n" + electronData.statusContent);
      res.end(electronData.statusContent)
      break;
    }
    case "/stop-status-watching": {
      console.log(""+req.method+" "+ url + " " + req.headers);
      // statusFileWatcher.close();
      fs.unwatchFile(electronData.statusFile);
      res.end('ok')
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

function writeStatue(status, error) {
  fs.writeFile(electronData.statusFile, JSON.stringify({stage: 'metaheuristic', status: status, error: error}) + '\n', (err) => {
    if (err) {
      fs.writeFile(electronData.statusFile, JSON.stringify({stage: 'metaheuristic', status: 'error', error: err.toString()}) + '\n', (err) => {
        if (err) {
          console.log("Error while writing an error to status file. " + JSON.stringify(err));
        }
      });
    }
  });
}

function startMetaheuristicServer() {
  try {
    writeStatue('start', null);

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
    writeStatue('done', null);
  } catch (e) {
    writeStatue('error', ''+e);
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

