export enum BuildConstants {
  BuildDir = 'public',
  AssetsDir = 'src/wwwroot',
  SrcIndexHtml = 'src/index.html',
  PublicIndexHtml = 'public/index.html',
  ClosingHeadTag = '</head>',
  ClosingBodyTag = '</body>',
  HotReloadScript = `<script>
new EventSource('/esbuild').addEventListener('change', e => {
  const { added, removed, updated } = JSON.parse(e.data);

  if (!added.length && !removed.length) {
    for (const link of document.getElementsByTagName('link')) {
      const url = new URL(link.href);

      const linkToUpdate = updated.find(u => u === url.pathname);
      if (url.host === location.host && url.pathname === linkToUpdate) {
        const next = link.cloneNode();
        next.href = linkToUpdate + '?' + Math.random().toString(36).slice(2);
        link.parentNode.insertBefore(next, link.nextSibling);
        setTimeout(() => link.remove(), 100);
        return;
      }
    }
  }
});
</script>`,
  BuildTimeLog = 'Build completed in'
}
