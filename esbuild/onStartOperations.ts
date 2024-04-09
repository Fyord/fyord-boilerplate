import * as fs from 'fs';
import { Strings } from 'tsbase/System/Strings';
import { BuildConstants } from './buildConstants';
import { BuildOperation } from './buildOperation';

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
