/*
 * =====================================================================
 * FINAL 'main.cjs' FILE WITH SECURITY POLICY
 * =====================================================================
 */
const { app, BrowserWindow, session } = require('electron');
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
  // This loads the built React app from the 'dist' folder
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

// This block is the fix for the '.exe' network error
app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          // Allow connections ('connect-src') to itself ('self')
          // AND to our live Render backend.
          "connect-src 'self' https://the-bank-ers-backend.onrender.com"
        ]
      }
    });
  });

  createWindow();
});

// Standard Electron window management
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
