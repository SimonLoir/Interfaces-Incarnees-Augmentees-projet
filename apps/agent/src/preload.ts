import { ipcRenderer } from 'electron';

ipcRenderer.send('get-sources');

ipcRenderer.on('sources', (event, sources) => {
    console.log('sources', sources);
});

console.log('preload.ts');
