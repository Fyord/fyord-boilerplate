/* eslint-disable no-console */
import * as esbuild from 'esbuild';

const args = process.argv.slice(2);

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
  console.log(`http://${host}:${port}`);
}
