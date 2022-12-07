const { ipcRenderer } = require('electron');

window.addEventListener('message', ({ data: { type } }) => {
    if (type === 'get-sources') {
        ipcRenderer.send('get-sources');
    }
});

ipcRenderer.on('sources', (event, sources) => {
    window.postMessage({
        type: 'sources',
        sources: sources.map((s) => ({
            name: s.name,
            id: s.id,
            thumbnail: s.thumbnail.toDataURL(),
        })),
    });
});
