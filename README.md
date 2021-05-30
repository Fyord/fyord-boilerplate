# fyord game boilerplate
Boilerplate project using the fyord framework to build a game

***This branch is in a prototype state***

## Installation / Local Development
- `npm i`
- `npm start`

## Lint
- `npm run lint`

## Test
- `npm run test` - watch enabled
- `npm run test-once` - code coverage collected

## Build
- `npm run build`
- `npm run pre-render` (optional)

## Deployment
Use either of the build strategies above, and deploy the `./public` directory.

Considerations:
- When deploying without a pre-render, you will need to configure the server to redirect 404s to `index.html` as with any other single page application.
- When deploying with a pre-render, you may have to configure your server to "clean" the urls.  Depending on the server, it may not match `/home` to `home.html` before doing so.

## Project Structure Map
- root
  - src
    - components - common reused components
    - pages
    - styles - global styles
    - wwwroot - static assets
    - environments.ts - dev/prod environment variables
    - index.html - root html file
    - index.ts - bootstraps the app
    - layouts.tsx
  - public - build output