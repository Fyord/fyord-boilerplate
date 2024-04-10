/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { BuildConstants } from './buildConstants';
import { onBuildStartOperations } from './onStartOperations';
import { beforeOperations } from './beforeOperations';

const args = process.argv.slice(2);
const isProductionBuild = args[0] === 'production';
const entryPoints = ['src/index.ts', 'src/service-worker.ts'];

const cleanOutputDirectory = () => {
  if (fs.existsSync(BuildConstants.BuildDir)) {
    fs.rmSync(BuildConstants.BuildDir, { force: true, recursive: true });
  }
  fs.mkdirSync(BuildConstants.BuildDir, {});
};

cleanOutputDirectory();

beforeOperations.forEach(operation => {
  operation(isProductionBuild);
});

const plugins: esbuild.BuildOptions['plugins'] = [
  {
    name: 'wasm',
    setup(build) {
      build.onResolve({ filter: /\.wasm$/ }, args => {
        if (args.resolveDir === '') {
          return;
        }
        return {
          path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
          namespace: 'wasm-binary'
        };
      });

      build.onLoad({ filter: /.*/, namespace: 'wasm-binary' }, async (args) => ({
        contents: await fs.promises.readFile(args.path),
        loader: 'binary'
      }));
    }
  },
  {
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
  }
];

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
