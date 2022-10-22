const { app, BrowserWindow, desktopCapturer, ipcMain } = require('electron');
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: process.cwd() + '/electron/preload.js',
        },
    });
    win.loadURL('http://localhost:3000');
};

app.whenReady().then(() => {
    console.log('test');
    createWindow();
});

ipcMain.on('get-sources', (event) => {
    desktopCapturer
        .getSources({ types: ['window', 'screen'] })
        .then((sources) => {
            event.sender.send('sources', sources);
        });
});
