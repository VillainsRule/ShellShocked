import fs from 'fs';
import path from 'path';
import * as childproc from 'child_process';
import * as url from 'url';

const copyToClip = (data) => {
    let proc = childproc.spawn('pbcopy'); 
    proc.stdin.write(data);
    proc.stdin.end();
};

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const compiledFileName = fs.readdirSync('./dist')[0];

const userscriptTemplate = fs.readFileSync(path.resolve(__dirname, 'template.txt'), 'utf-8');
const bundledCode = fs.readFileSync(path.resolve(__dirname, '../dist/' + compiledFileName), 'utf-8');

const cleanBundledCode = bundledCode.split('\n').filter(s => s.trim() !== '').join('\n');
const userscriptCode = userscriptTemplate.replace('{{code}}', cleanBundledCode);

fs.unlinkSync(path.resolve(__dirname, '../dist/' + compiledFileName))
fs.writeFileSync(path.resolve(__dirname, '../dist/shellshocked.user.js'), userscriptCode);

copyToClip(userscriptCode);

console.log('Userscript generated & copied to your clipboard for convenience.');