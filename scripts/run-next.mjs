import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const command = process.argv[2];
const useTurbo = process.argv.includes('--turbo');

if (command !== 'dev' && command !== 'start') {
  console.error('Usage: node scripts/run-next.mjs <dev|start> [--turbo]');
  process.exit(1);
}

const port = process.env.PORT || '9002';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const nextBin = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'next.cmd' : 'next');

const args =
  command === 'dev'
    ? ['dev', '--hostname', '0.0.0.0', '-p', port, ...(useTurbo ? ['--turbopack'] : [])]
    : ['start', '--hostname', '0.0.0.0', '-p', port];

const child = spawn(nextBin, args, {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
