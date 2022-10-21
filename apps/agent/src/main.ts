import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import Server from './Server';
import Leap from 'leapjs';
console.log(Leap);
if (existsSync('.env.local')) dotenv.config({ path: '.env.local' });

(async () => {
    await Server.getInstance().start();
})();
