import { App, Environments } from 'fyord';
import { defaultLayout } from './core/module';

import './pages/module';

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);
})();
