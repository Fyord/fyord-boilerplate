/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import { BuildConstants } from './buildConstants';
import { onBuildStartOperations } from './onStartOperations';
import { beforeOperations } from './beforeOperations';

const args = process.argv.slice(2);
const isProductionBuild = args[0] === 'production';
const entryPoints = ['src/index.ts', 'src/service-worker.ts'];

beforeOperations.forEach(operation => {
  operation(isProductionBuild);
});

const plugins: esbuild.BuildOptions['plugins'] = [{
  name: 'onBuild',
  setup(build) {
    build.onStart(() => {
      onBuildStartOperations.forEach(operation => {
        operation(isProductionBuild);
      });
    });
    build.onEnd(r => {
      r.errors.length && console.error('errors', r.errors);
      r.warnings.length && console.warn('warnings', r.warnings);
    });
    build.onDispose(() => console.timeEnd(BuildConstants.BuildTimeLog));
  }
}];

if (isProductionBuild) {
  await esbuild.build({
    entryPoints,
    bundle: true,
    outdir: BuildConstants.BuildDir,
    minify: true,
    treeShaking: true,
    plugins
  });
} else {
  const context = await esbuild.context({
    entryPoints,
    bundle: true,
    outdir: BuildConstants.BuildDir,
    sourcemap: true,
    sourceRoot: 'src',
    plugins
  });

  await context.watch();
  const { port } = await context.serve({
    servedir: BuildConstants.BuildDir,
    port: 4200,
    host: 'localhost'
  });

  const localhostUrl = `http://localhost:${port}`;
  console.log(`Serving at ${localhostUrl}`);
}
