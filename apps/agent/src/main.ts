import * as Leap from 'leapjs';
import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import * as path from 'path';

const dev = process.env.NODE_ENV === 'development';
const loadURL = serve({ directory: 'app' });
const appUrl = dev ? 'http://localhost:3000' : 'app://./index.html';

console.log('dev mode : ', dev, appUrl);

async function newWindow() {
    const main = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: true,
        },
        title: 'User Agent',
    });

    main.setMenu(null);

    if (!dev) await loadURL(main);
    main.loadURL(appUrl);
}

app.whenReady().then(async () => {
    // Used on macOS device when the app is in the dock but no windows are open.
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) newWindow();
    });
});

app.on('window-all-closed', function () {
    // Prevents the app from quitting on macOS devices
    if (process.platform !== 'darwin') app.quit();
});
