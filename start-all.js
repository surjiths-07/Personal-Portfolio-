const { spawn } = require('child_process');
const path = require('path');

const mode = process.argv[2] === 'start' ? 'start' : 'dev';
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function launch(name, cwd, args) {
  const child = spawn(npmCmd, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
}

console.log(`Starting Personal Portfolio (${mode})...`);
const backend = launch('backend', path.join(__dirname, 'backend'), ['run', mode]);
const frontend = launch('frontend', path.join(__dirname, 'frontend'), ['run', 'dev']);

function shutdown() {
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
