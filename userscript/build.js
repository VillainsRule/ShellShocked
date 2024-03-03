import fs from 'fs';
import path from 'path';
import config from '../config.js';
import * as childproc from 'child_process';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const userscriptTemplate = fs.readFileSync(path.resolve(__dirname, 'template.txt'), 'utf-8');
const bundledCode = fs.readFileSync(path.resolve(__dirname, '../dist/shellshocked.min.js'), 'utf-8');

const userscriptCode = userscriptTemplate
    .replace('{{code}}', bundledCode)
    .replace('{{version}}', config.version)
    .replace('{{buildID}}', config.devBuildID ? '-dev' + Math.random().toString(36).slice(7) : '');

fs.writeFileSync(path.resolve(__dirname, '../dist/shellshocked.user.js'), userscriptCode);

let proc = childproc.spawn('pbcopy');
proc.stdin.write(userscriptCode);
proc.stdin.end();

if (config.logOutput) console.log(bundledCode);

console.log('\nUserscript generated & copied to your clipboard.');