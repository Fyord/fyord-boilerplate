# fyord boilerplate
Boilerplate project using the fyord framework

## Installation / Local Development
- `npm i`
- `npm start`

### Snippets
Snippets are included (prefix `fy-`) to allow quick scaffolding

## Lint
- `npm run lint`

## Test
- `npm run test` - watch enabled
- `npm run test-once` - code coverage collected

## Build
### Production build without pre-render
- `npm run build`

### With pre-render
- `npm run start-prod` - will serve a production build
- `npm run pre-render` - in a separate terminal
  - Uses Puppeteer to render and crawl your app. Html files are created for each page.  JSON and XML sitemaps are also generated.


## Deployment
Use either of the build strategies above, and deploy the `./public` directory.

Considerations:
- When deploying without a pre-render, you will need to configure the server to redirect 404s to `index.html` as with any other single page application.
- When deploying with a pre-render, you may have to configure your server to "clean" the urls.  Depending on the server, it may not match `/home` to `home.html` before doing so.
