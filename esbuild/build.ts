/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { BuildConstants } from './buildConstants';
import { onBuildStartOperations } from './onStartOperations';
import { beforeOperations } from './beforeOperations';
import { onBuildEndOperations } from './onEndOperations';

const args = process.argv.slice(2);
const isProductionBuild = args[0] === 'production';
const browserEntryPoints = ['src/index.ts', 'src/service-worker.ts'];
const nodeEntryPoints = [];
const outdir = BuildConstants.BuildDir;

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
        onBuildEndOperations.forEach(operation => {
          operation(isProductionBuild, r);
        });
      });
      build.onDispose(() => console.timeEnd(BuildConstants.BuildTimeLog));
    }
  }
];

if (isProductionBuild) {
  if (nodeEntryPoints.length) {
    await esbuild.build({
      entryPoints: nodeEntryPoints,
      bundle: false,
      outdir,
      minify: true,
      treeShaking: true
    });
  }
  await esbuild.build({
    entryPoints: browserEntryPoints,
    bundle: true,
    outdir,
    minify: true,
    treeShaking: true,
    plugins
  });
} else {
  if (nodeEntryPoints.length) {
    const nodeContext = await esbuild.context({
      entryPoints: nodeEntryPoints,
      bundle: false,
      outdir,
      sourcemap: true,
      sourceRoot: 'src'
    });

    await nodeContext.watch();
  }

  const browserContext = await esbuild.context({
    entryPoints: browserEntryPoints,
    bundle: true,
    outdir,
    sourcemap: true,
    sourceRoot: 'src',
    plugins
  });

  await browserContext.watch();

  if (!nodeEntryPoints.length) {
    const { port } = await browserContext.serve({
      servedir: BuildConstants.BuildDir,
      port: 4200,
      host: 'localhost'
    });

    const localhostUrl = `http://localhost:${port}`;
    console.log(`Serving at ${localhostUrl}`);
  }
}
