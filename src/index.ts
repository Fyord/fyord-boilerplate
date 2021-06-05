import { App, Environments } from 'fyord';
import { defaultLayout } from './layouts';
import { ControlConfig, Controller, Game, PlayAudio } from './core/module';
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

function handleContinueButton() {
  if (Controller.Instance.GetControlValue(Controls.Continue)) {
    const anchor = document.querySelector('a');
    anchor?.click();
    Game.Instance.GlobalEvent.Discontinue();

    setTimeout(() => {
      Game.Instance.GlobalEvent.Reinstate();
    }, 1000);
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
    [Controls.Right, { Key: Keys.ArrowRight, GamepadAxis: { Axis: 0, Positive: true } }],
    [Controls.ThrustUp, { Key: Keys.W, GamepadAxis: { Axis: 1, Positive: false } }],
    [Controls.ThrustDown, { Key: Keys.S, GamepadAxis: { Axis: 1, Positive: true } }],
    [Controls.ThrustLeft, { Key: Keys.A, GamepadAxis: { Axis: 0, Positive: false } }],
    [Controls.ThrustRight, { Key: Keys.D, GamepadAxis: { Axis: 0, Positive: true } }],
    [Controls.RotateLeft, { Key: Keys.ArrowLeft, GamepadAxis: { Axis: 2, Positive: false } }],
    [Controls.RotateRight, { Key: Keys.ArrowRight, GamepadAxis: { Axis: 2, Positive: true } }],
    [Controls.Fire, { Key: Keys.Space, GamepadButtons: [6, 7] }],
    [Controls.Continue, { Key: Keys.Enter, GamepadButtons: [0] }]
  ]));

  Game.Instance.GlobalEvent.Subscribe(() => {
    handlePauseButton();
    handleContinueButton();
  });

  window['app'] = app;
  window['game'] = Game.Instance;
})();

import './levels/module';
