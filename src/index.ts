import { App, ControlConfig, Controller, Environments, Game, PlayAudio } from 'fyord-game-engine';
import { defaultLayout } from './layouts';
import { Controls, Keys, Sounds } from './enums/module';

import './styles/base.scss';

function handlePauseButton() {
  if (Controller.Instance.GetControlValue(Controls.Pause)) {
    Game.Instance.TogglePause();
    Game.Instance.GlobalEvent.Discontinue();
    PlayAudio(Sounds.Pause);

    setTimeout(() => {
      Game.Instance.GlobalEvent.Reinstate();
    }, 500);
  }
}

(async () => {
  const app = App.Instance(process.env.NODE_ENV || Environments.Production);
  await app.Start(defaultLayout);

  Game.Instance.GameLoop.Start(Game.TargetFramerate);

  Controller.Instance.SetControls(new Map<Controls, ControlConfig>([
    [Controls.Pause, { Key: Keys.Escape, GamepadButtons: [9] }],
    [Controls.Up, { Key: Keys.ArrowUp, GamepadAxis: { Axis: 1, Positive: false } }],
    [Controls.Down, { Key: Keys.ArrowDown, GamepadAxis: { Axis: 1, Positive: true } }],
    [Controls.Left, { Key: Keys.ArrowLeft, GamepadAxis: { Axis: 0, Positive: false } }],
    [Controls.Right, { Key: Keys.ArrowRight, GamepadAxis: { Axis: 0, Positive: true } }]
  ]));

  Game.Instance.GlobalEvent.Subscribe(() => {
    handlePauseButton();
  });
})();

import './levels/module';
