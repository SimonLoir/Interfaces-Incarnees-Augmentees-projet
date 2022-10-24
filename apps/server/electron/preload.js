const { ipcRenderer } = require('electron');

console.log('hello from preload');

window.addEventListener('message', ({ data: { type } }) => {
    if (type === 'get-sources') {
        ipcRenderer.send('get-sources');
        console.log('get sources called');
    }
});

ipcRenderer.on('sources', (event, sources) => {
    console.log('sources', sources);
    window.postMessage({
        type: 'sources',
        sources: sources.map((s) => ({
            name: s.name,
            id: s.id,
            thumbnail: s.thumbnail.toDataURL(),
        })),
    });
});
