/*
 * =====================================================================
 * THE CORRECTED 'main.cjs' FILE WITH SECURITY POLICY
 * =====================================================================
 */

const { app, BrowserWindow, session } = require('electron'); // <-- 1. Import 'session'
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

// This 'whenReady' block is the new, important part
app.whenReady().then(() => {
  
  // 2. This is the fix. We are modifying the security policy.
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        // This line tells Electron:
        // "Allow this app to connect ('connect-src') to itself ('self')
        // AND to our live backend server on Render."
        'Content-Security-Policy': [
          "connect-src 'self' https://the-bank-ers-backend.onrender.com"
        ]
      }
    });
  });

  // 3. Create the window *after* setting the policy
  createWindow();
});

// Standard Electron code (leave this as-is)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});