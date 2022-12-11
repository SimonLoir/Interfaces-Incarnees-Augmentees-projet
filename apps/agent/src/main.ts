import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import Server from './Server';
import electron from 'electron';
import { spawn } from 'child_process';

// Load environment variables if a .env.local file exists
if (existsSync('.env.local')) dotenv.config({ path: '.env.local' });

(async () => {
    // Starts the HTTP server
    await Server.getInstance().start();

    // Starts the electron app if the ELECTRON environment variable is set to true
    if (process.env.ELECTRON === 'true') {
        const p = spawn(String(electron), ['./electron/app.js']);
        p.stdout.on('data', (data) => {
            // Allows us to see the electron logs in the server logs
            console.log(`Electron : ${data}`);
        });
    }
})();
