import { App, Environments } from 'fyord';
import { defaultLayout } from './layouts';

import './styles/base.css';

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);
})();

import './pages/module';
