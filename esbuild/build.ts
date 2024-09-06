/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { beforeOperations, onBuildStartOperations, onBuildEndOperations, afterOperations } from './buildOperations';
import { BuildConstants } from './buildConstants';
import { sassPlugin, postcssModules } from 'esbuild-sass-plugin';

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

beforeOperations.forEach(operation => operation(isProductionBuild));

const plugins: esbuild.BuildOptions['plugins'] = [
  sassPlugin({
    filter: /\.module\.scss$/,
    transform: postcssModules({
      generateScopedName: '[name]__[local]',
      hashPrefix: 'prefix'
    })
  }),
  sassPlugin({
    filter: /\.scss$/
  }),
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
        console.time(BuildConstants.BuildTimeLog);
        onBuildStartOperations.forEach(operation => operation(isProductionBuild));
      });
      build.onEnd(r => {
        console.timeEnd(BuildConstants.BuildTimeLog);
        onBuildEndOperations.forEach(operation => operation(isProductionBuild, r));
      });
    }
  }
];

if (isProductionBuild) {
  if (nodeEntryPoints.length) {
    await esbuild.build({
      entryPoints: nodeEntryPoints,
      bundle: false,
      outdir,
      minify: true
    });
  }
  await esbuild.build({
    entryPoints: browserEntryPoints,
    bundle: true,
    outdir,
    minify: true,
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
      host: 'localhost',
      fallback: 'public/index.html'
    });

    const localhostUrl = `http://localhost:${port}`;
    console.log(`Serving at ${localhostUrl}`);
  }
}

afterOperations.forEach(operation => operation(isProductionBuild));
