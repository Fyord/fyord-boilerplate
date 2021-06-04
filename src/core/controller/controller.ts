import { EventTypes } from 'fyord';
import { Queryable } from 'tsbase/Collections/Queryable';
import { Controls, Keys } from '../../enums/module';
import { Game } from '../game/game';

export type ControlConfig = {
  Key: string | null,
  GamepadButtons: number[] | null,
  GamepadAxis: { Axis: number, Positive: boolean } | null
};

export class Controller {
  private static instance: Controller | null = null;
  public static get Instance(): Controller { return this.instance || (this.instance = new Controller()); }
  public static Destroy(): void { this.instance = null; }

  private keyboard = {};
  private controlMap = new Map<Controls, ControlConfig>([
    [Controls.Pause, { Key: Keys.Escape, GamepadButtons: [9], GamepadAxis: null }],
    [Controls.Up, { Key: Keys.ArrowUp, GamepadButtons: null, GamepadAxis: { Axis: 1, Positive: false } }],
    [Controls.Down, { Key: Keys.ArrowDown, GamepadButtons: null, GamepadAxis: { Axis: 1, Positive: true } }],
    [Controls.Left, { Key: Keys.ArrowLeft, GamepadButtons: null, GamepadAxis: { Axis: 0, Positive: false } }],
    [Controls.Right, { Key: Keys.ArrowRight, GamepadButtons: null, GamepadAxis: { Axis: 0, Positive: true } }],
    [Controls.ThrustUp, { Key: Keys.W, GamepadButtons: null, GamepadAxis: { Axis: 1, Positive: false } }],
    [Controls.ThrustDown, { Key: Keys.S, GamepadButtons: null, GamepadAxis: { Axis: 1, Positive: true } }],
    [Controls.ThrustLeft, { Key: Keys.A, GamepadButtons: null, GamepadAxis: { Axis: 0, Positive: false } }],
    [Controls.ThrustRight, { Key: Keys.D, GamepadButtons: null, GamepadAxis: { Axis: 0, Positive: true } }],
    [Controls.RotateLeft, { Key: Keys.ArrowLeft, GamepadButtons: null, GamepadAxis: { Axis: 2, Positive: false } }],
    [Controls.RotateRight, { Key: Keys.ArrowRight, GamepadButtons: null, GamepadAxis: { Axis: 2, Positive: true } }],
    [Controls.Fire, { Key: Keys.Space, GamepadButtons: [6, 7], GamepadAxis: null }],
    [Controls.Continue, { Key: Keys.Enter, GamepadButtons: [0], GamepadAxis: null }]
  ]);

  private get gamepad(): Gamepad | null {
    let gamepad: Gamepad | null = null;
    const gamepads = navigator.getGamepads();

    for (let i = 0; i < 4; i++) {
      if (gamepads[i]) {
        gamepad = gamepads[i];
        break;
      }
    }

    return gamepad;
  }

  private constructor(private game = Game.Instance) {
    document.addEventListener(EventTypes.Keydown, (e: KeyboardEvent) => {
      this.keyboard[e.key] = 1;
    });

    document.addEventListener(EventTypes.Keyup, (e: KeyboardEvent) => {
      this.keyboard[e.key] = 0;
    });

    this.game.GlobalEvent.Subscribe(() => {
      this.handlePauseButton();
      this.handleContinueButton();
    });
  }

  public GetControlValue = (control: Controls): number => {
    let value = 0;
    const config = this.controlMap.get(control);

    if (config) {
      const controllerValue = this.getControllerValue(config);
      const keyboardValue = this.getKeyBoardValue(config) || 0;

      value = Math.abs(controllerValue) > Math.abs(keyboardValue)
        ? controllerValue : keyboardValue;
    }

    return value;
  }

  private getKeyBoardValue(config: ControlConfig) {
    let keyboardValue = 0;

    if (config.Key) {
      keyboardValue = this.keyboard[config.Key];
    }
    return keyboardValue;
  }

  // eslint-disable-next-line complexity
  private getControllerValue(config: ControlConfig) {
    let controllerValue = 0;

    if (this.gamepad && config.GamepadAxis) {
      const positive = config.GamepadAxis.Positive;
      const axisValue = this.gamepad.axes[config.GamepadAxis.Axis];
      if (positive) {
        controllerValue = axisValue > 0 ? axisValue * -1 : 0;
      } else {
        controllerValue = axisValue < 0 ? axisValue : 0;
      }
    } else if (this.gamepad && config.GamepadButtons) {
      const values = this.gamepad.buttons
        .filter((_b, i) => config.GamepadButtons?.includes(i))
        .map(b => b.value);
      controllerValue = Queryable.From(values).Max();
    }

    return Math.abs(controllerValue);
  }

  private handlePauseButton() {
    if (this.GetControlValue(Controls.Pause)) {
      this.game.TogglePause();
      this.game.GlobalEvent.Discontinue();

      setTimeout(() => {
        this.game.GlobalEvent.Reinstate();
      }, 500);
    }
  }

  private handleContinueButton() {
    if (this.GetControlValue(Controls.Continue)) {
      const anchor = document.querySelector('a');
      anchor?.click();
      this.game.GlobalEvent.Discontinue();

      setTimeout(() => {
        this.game.GlobalEvent.Reinstate();
      }, 1000);
    }
  }
}
