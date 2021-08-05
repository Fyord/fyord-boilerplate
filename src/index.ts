import { App, Environments } from 'fyord';
import { defaultLayout } from './layouts';

import './styles/base.css';

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);

  if (navigator.serviceWorker) {
    await navigator.serviceWorker.register(
      '/service-worker.js', { scope: '/' });
  }
})();

import './pages/module';
