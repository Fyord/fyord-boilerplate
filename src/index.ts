import { App, Environments } from 'fyord';
import { defaultLayout } from './layouts';
import { Controller } from './core/module';
import { Game } from './core/game/game';

import './styles/base.scss';

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);
  Game.Instance.GameLoop.Start(Game.TargetFramerate);
  Controller.Instance;

  window['app'] = app;
  window['game'] = Game.Instance;
})();

import './levels/module';
