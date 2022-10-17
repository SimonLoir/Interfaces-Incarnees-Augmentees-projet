//import * as Leap from 'leapjs';
import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import serve from 'electron-serve';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

// Loads the environment variables from the .env.local file
if (existsSync('.env.local')) dotenv.config({ path: '.env.local' });

const dev = process.env.NODE_ENV === 'development';
const loadURL = serve({ directory: 'app' });
const appUrl = dev ? 'http://localhost:3000' : 'app://./index.html';

ipcMain.on('get-sources', async (event) => {
    const sources = await desktopCapturer.getSources({
        types: ['screen', 'window'],
    });
    event.sender.send('sources', sources);
});

async function newWindow() {
    const main = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: true,
        },
        title: 'IronProf Agent',
    });

    //main.setMenu(null);

    if (!dev) await loadURL(main);
    main.loadURL(appUrl);
}

app.whenReady().then(async () => {
    newWindow();
    // Used on macOS device when the app is in the dock but no windows are open.
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) newWindow();
    });
});

app.on('window-all-closed', function () {
    // Prevents the app from quitting on macOS devices
    if (process.platform !== 'darwin') app.quit();
});
