/* eslint-disable no-console */
import * as fs from 'fs';
import { BuildOptions, BuildResult } from 'esbuild';
import { Strings } from 'tsbase/System/Strings';
import { BuildConstants } from './buildConstants';

export type BuildOperation = (isProductionBuild: boolean, options?: any) => void;

export const beforeOperations: BuildOperation[] = [
];

const buildStaticFiles: BuildOperation = (isProductionBuild: boolean) => {
  fs.cpSync(BuildConstants.AssetsDir, BuildConstants.BuildDir, { recursive: true });
  const indexContents = fs.readFileSync(BuildConstants.SrcIndexHtml).toString()
    .replace(BuildConstants.ClosingHeadTag, `<link rel="stylesheet" href="index.css?${Date.now()}"></head>`)
    .replace(BuildConstants.ClosingBodyTag, `<script src="index.js?${Date.now()}"></script></body>`)
    .replace(BuildConstants.ClosingBodyTag, isProductionBuild ?
      BuildConstants.ClosingBodyTag : `${BuildConstants.HotReloadScript}${BuildConstants.ClosingBodyTag}`);
  fs.writeFileSync(BuildConstants.PublicIndexHtml, Strings.MinifyXml(indexContents));
};

export const onBuildStartOperations: BuildOperation[] = [
  buildStaticFiles
];

const logErrors: BuildOperation = (_isProductionBuild: boolean, r: BuildResult<BuildOptions>) => {
  r.errors.length && console.error('errors', r.errors);
  r.warnings.length && console.warn('warnings', r.warnings);
};

export const onBuildEndOperations: BuildOperation[] = [
  logErrors
];

export const afterOperations: BuildOperation[] = [
];
