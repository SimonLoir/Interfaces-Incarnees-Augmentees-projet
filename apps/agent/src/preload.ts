import { ipcRenderer } from 'electron';

ipcRenderer.on('sources', (_, sources: Electron.DesktopCapturerSource[]) => {
    window.postMessage({
        type: 'sources',
        sources: sources.map(({ id, name, display_id, thumbnail }) => ({
            id,
            name,
            display_id,
            thumbnail: thumbnail.toDataURL(),
        })),
    });
});

window.addEventListener('message', (e) => {
    if (e.data === 'get-sources') ipcRenderer.send('get-sources');
});

console.log('preload.ts');
