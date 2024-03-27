export enum BuildConstants {
  BuildDir = 'public',
  AssetsDir = 'src/wwwroot',
  SrcIndexHtml = 'src/index.html',
  PublicIndexHtml = 'public/index.html',
  ClosingHeadTag = '</head>',
  ClosingBodyTag = '</body>',
  HotReloadScript = "<script>new EventSource('/esbuild').addEventListener('change', () => location.reload())</script>"
}
