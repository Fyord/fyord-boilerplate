/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import * as fs from 'fs';

const args = process.argv.slice(2);
const isProductionBuild = args[0] === 'production';

const buildStaticFiles = () => {
  if (fs.existsSync('public')) {
    fs.rmSync('public', { force: true, recursive: true });
  }

  fs.mkdirSync('public', {});
  fs.cpSync('src/wwwroot', 'public', { recursive: true });
  // fs.cpSync('src/index.html', 'public/index.html');
  const indexContents = fs.readFileSync('src/index.html').toString()
    .replace('</head>', `  <link rel="stylesheet" href="index.css?${Date.now()}">
  </head>`)
    .replace('</body>', `  <script src="index.js?${Date.now()}"></script>
  </body>`)
    // eslint-disable-next-line max-len
    .replace('</body>', isProductionBuild ? '</body>' : `  <script>new EventSource('/esbuild').addEventListener('change', () => location.reload())</script>
  </body>`);
  fs.writeFileSync('public/index.html', indexContents);
};

const entryPoints = ['src/index.ts', 'src/service-worker.ts'];
const plugins = [{
  name: 'onBuild',
  setup(build) {
    build.onStart(() => {
      buildStaticFiles();
    });
    build.onEnd(r => console.log(`Build completed: ${JSON.stringify(r)}`));
  }
}];

if (isProductionBuild) {
  await esbuild.build({
    entryPoints,
    bundle: true,
    outdir: 'public',
    minify: true,
    treeShaking: true,
    plugins
  });
} else {
  const context = await esbuild.context({
    entryPoints,
    bundle: true,
    outdir: 'public',
    sourcemap: true,
    sourceRoot: 'src',
    plugins
  });

  await context.watch();
  const { port } = await context.serve({
    servedir: 'public',
    port: 4200,
    host: 'localhost'
  });

  const localhostUrl = `http://localhost:${port}`;
  console.log(`Serving at ${localhostUrl}`);
}
