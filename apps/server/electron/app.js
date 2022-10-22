const { app, BrowserWindow } = require('electron');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: process.cwd() + '/electron/preload.js',
        },
    });
    win.loadURL('http://localhost:3001');
};

app.whenReady().then(() => {
    console.log('test');
    createWindow();
});
