import { Strings } from 'tsbase/System/Strings';
import * as fs from 'fs';
import { BuildConstants } from './buildConstants';

type OnStartOperation = (isProductionBuild: boolean) => void;

const buildStaticFiles: OnStartOperation = (isProductionBuild: boolean) => {
  if (fs.existsSync(BuildConstants.BuildDir)) {
    fs.rmSync(BuildConstants.BuildDir, { force: true, recursive: true });
  }

  fs.mkdirSync(BuildConstants.BuildDir, {});
  fs.cpSync(BuildConstants.AssetsDir, BuildConstants.BuildDir, { recursive: true });
  const indexContents = fs.readFileSync(BuildConstants.SrcIndexHtml).toString()
    .replace(BuildConstants.ClosingHeadTag, `<link rel="stylesheet" href="index.css?${Date.now()}"></head>`)
    .replace(BuildConstants.ClosingBodyTag, `<script src="index.js?${Date.now()}"></script></body>`)
    .replace(BuildConstants.ClosingBodyTag, isProductionBuild ?
      BuildConstants.ClosingBodyTag : `${BuildConstants.HotReloadScript}${BuildConstants.ClosingBodyTag}`);
  fs.writeFileSync(BuildConstants.PublicIndexHtml, Strings.MinifyXml(indexContents));
};

export const onBuildStartOperations = [
  buildStaticFiles
];
