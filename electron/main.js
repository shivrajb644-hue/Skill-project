const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const net = require('net');
const { spawn } = require('child_process');
const fs = require('fs');

// --- 1. SEPARATE & PERSISTENT DATA STORAGE ---
// Ensure student profiles, progress, assessments in IndexedDB/LocalStorage
// are stored in a dedicated directory in %APPDATA% that is NEVER wiped by builds/updates.
const customUserDataPath = path.join(app.getPath('appData'), 'SoftSkillsPlatformData');
try {
  if (!fs.existsSync(customUserDataPath)) {
    fs.mkdirSync(customUserDataPath, { recursive: true });
  }
  app.setPath('userData', customUserDataPath);
  console.log('[Electron] Persistent UserData Directory set to:', customUserDataPath);
} catch (err) {
  console.error('[Electron] Error setting custom userData path:', err);
}

// --- 2. LOAD EXTERNAL OR LOCAL .env.local ---
function loadEnvLocal() {
  const possiblePaths = [
    path.join(path.dirname(process.execPath), '.env.local'), // Next to packaged .exe
    path.join(app.getAppPath(), '.env.local'),               // Inside app directory
    path.join(process.cwd(), '.env.local')                  // Current working directory
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log('[Electron] Loading configuration from:', envPath);
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split(/\r?\n/).forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const key = trimmed.substring(0, idx).trim();
            const val = trimmed.substring(idx + 1).trim();
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        });
      } catch (e) {
        console.error('[Electron] Failed reading env file:', e.message);
      }
      break;
    }
  }
}

loadEnvLocal();

let mainWindow = null;
let serverProcess = null;
let chosenPort = 3000;

// Helper: Check if a port responds
function checkHealth(port, retries = 30, intervalMs = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      attempts++;
      const req = http.get(`http://localhost:${port}/`, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 500) {
          resolve(true);
        } else {
          retry();
        }
      });
      req.on('error', () => retry());
      req.setTimeout(800, () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (attempts >= retries) {
        reject(new Error(`Server did not respond on port ${port} after ${retries} attempts`));
      } else {
        setTimeout(check, intervalMs);
      }
    };

    check();
  });
}

// Helper: Find next available port if default is occupied
function getAvailablePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => {
      resolve(getAvailablePort(startPort + 1));
    });
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

// Helper: Start Next.js server
async function startNextServer() {
  // First, check if port 3000 is already active
  try {
    const isAlreadyRunning = await checkHealth(3000, 2, 300);
    if (isAlreadyRunning) {
      console.log('[Electron] Local server already active on port 3000. Reusing it.');
      chosenPort = 3000;
      return;
    }
  } catch {}

  // Find a free port so EADDRINUSE never occurs
  chosenPort = await getAvailablePort(3000);
  console.log('[Electron] Selected available port:', chosenPort);

  const isDev = !app.isPackaged;
  console.log(`[Electron] Starting Next.js server (mode: ${isDev ? 'dev' : 'production'})...`);

  const serverEnv = {
    ...process.env,
    PORT: String(chosenPort),
    NODE_ENV: isDev ? 'development' : 'production'
  };

  if (isDev) {
    // In development mode, launch Next.js start or dev
    const rootDir = app.getAppPath();
    serverProcess = spawn('cmd.exe', ['/c', 'npm run start'], {
      cwd: rootDir,
      env: serverEnv,
      stdio: 'pipe'
    });
  } else {
    // In packaged application
    const appDir = app.getAppPath();
    const standaloneServerPath = path.join(appDir, '.next', 'standalone', 'server.js');
    const fallbackServerPath = path.join(process.resourcesPath, '.next', 'standalone', 'server.js');

    const targetScript = fs.existsSync(standaloneServerPath) 
      ? standaloneServerPath 
      : fallbackServerPath;

    if (fs.existsSync(targetScript)) {
      console.log('[Electron] Spawning standalone Next server at:', targetScript);
      serverProcess = spawn(process.execPath, [targetScript], {
        cwd: path.dirname(targetScript),
        env: { ...serverEnv, ELECTRON_RUN_AS_NODE: '1' },
        stdio: 'pipe'
      });
    } else {
      console.warn('[Electron] Standalone server.js not found, falling back to npm start');
      serverProcess = spawn('cmd.exe', ['/c', 'npm run start'], {
        cwd: appDir,
        env: serverEnv,
        stdio: 'pipe'
      });
    }
  }

  if (serverProcess) {
    serverProcess.stdout.on('data', d => console.log('[Next.js]', d.toString().trim()));
    serverProcess.stderr.on('data', d => console.error('[Next.js Error]', d.toString().trim()));
    serverProcess.on('exit', code => console.log('[Next.js] Server process exited with code:', code));
  }

  // Wait for the server to be ready
  await checkHealth(chosenPort, 40, 1000);
  console.log(`[Electron] Next.js is healthy on http://localhost:${chosenPort}`);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Soft Skills Learning Platform',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#020617', // Match dark theme slate-950
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  mainWindow.setMenuBarVisibility(false);

  // Open external URLs in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://localhost')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(`http://localhost:${chosenPort}`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('get-user-data-path', () => {
  return customUserDataPath;
});

// App lifecycle
app.whenReady().then(async () => {
  try {
    await startNextServer();
    createMainWindow();
  } catch (err) {
    console.error('[Electron] Failed to start:', err);
    // Show error window
    const errWin = new BrowserWindow({ width: 600, height: 400 });
    errWin.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
      <html>
        <body style="background:#0f172a;color:#fff;font-family:sans-serif;padding:30px;line-height:1.6;">
          <h2 style="color:#ef4444;">Server Launch Error</h2>
          <p>The local platform server failed to start.</p>
          <pre style="background:#1e293b;padding:15px;border-radius:8px;font-size:12px;overflow:auto;">${err.message}</pre>
        </body>
      </html>
    `)}`);
  }
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    console.log('[Electron] Terminating background server process...');
    try {
      if (process.platform === 'win32' && serverProcess.pid) {
        spawn('taskkill', ['/pid', String(serverProcess.pid), '/f', '/t']);
      } else {
        serverProcess.kill();
      }
    } catch (e) {}
  }
  app.quit();
});
