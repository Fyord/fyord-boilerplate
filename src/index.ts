import { App, Environments } from 'fyord';
import { defaultLayout } from './layouts';
import { Game } from './core/game/game';

import './styles/base.scss';

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);
  Game.Instance.GameLoop.Start(60);

  window['app'] = app;
  window['game'] = Game.Instance;
})();

import './levels/module';
