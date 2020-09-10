const fs = require('fs'),
  { spawn } = require('child_process');

console.log('[BUILD] Global process run\n\n\n');

const { pages } = JSON.parse(fs.readFileSync('./my-config.json'));

const runPageBuild = (pages, i) => {
  if (i === pages.length) return;
  const page = pages[i];
  console.log(`[BUILD] ${page} PAGE build run\n`);
  const proc = spawn('gulp.cmd', ['build', '--name', page]);
  proc.stderr.on('data', data => {
    console.log('[ERROR]');
    console.log(`${data}`);
  });
  proc.on('close', code => {
    console.log(`[BUILD] PAGE ${page} BUILDING precess exited with code ${code}\n\n`)
    runPageBuild(pages, i + 1);
  });
};

runPageBuild(pages, 0);