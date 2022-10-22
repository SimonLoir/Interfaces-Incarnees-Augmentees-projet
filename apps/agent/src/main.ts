import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import Server from './Server';
import electron from 'electron';
import { spawn } from 'child_process';

if (existsSync('.env.local')) dotenv.config({ path: '.env.local' });

(async () => {
    await Server.getInstance().start();
    if (process.env.ELECTRON === 'true') {
        const p = spawn(String(electron), ['./electron/app.js']);
        p.stdout.on('data', (data) => {
            console.log(`Electron : ${data}`);
        });
    }
})();
