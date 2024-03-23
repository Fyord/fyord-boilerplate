/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import * as fs from 'fs';

const args = process.argv.slice(2);

if (fs.existsSync('public')) {
  fs.rmSync('public', { force: true, recursive: true }, (e) => console.error(e));
}

fs.mkdirSync('public', {}, (e) => console.error(e));
fs.cpSync('src/wwwroot', 'public', { recursive: true });
// fs.cpSync('src/index.html', 'public/index.html');
const indexContents = fs.readFileSync('src/index.html').toString()
  .replace('</head>', `  <link rel="stylesheet" href="index.css?${Date.now()}">
</head>`)
  .replace('</body>', `  <script src="index.js?${Date.now()}"></script>
</body>`)
  // eslint-disable-next-line max-len
  .replace('</body>', args[0] === 'production' ? '</body>' : `  <script>new EventSource('/esbuild').addEventListener('change', () => location.reload())</script>
</body>`);
fs.writeFileSync('public/index.html', indexContents);

if (args[0] === 'production') {
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'public',
    minify: true,
    treeShaking: true
  });
} else {
  const context = await esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'public'
  });

  await context.watch();
  const { host, port } = await context.serve({
    servedir: 'public',
    port: 4200,
    host: 'localhost'
  });

  const localhostUrl = `http://${host}:${port}`;
  console.log(`Serving at ${localhostUrl}`);
}
