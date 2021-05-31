import { EventTypes } from 'fyord';
import { Controls, Keys } from '../../enums/module';
import { Game } from '../game/game';

export type ControlConfig = {
  Key: string | null,
  GamepadButton: number | null,
  GamepadAxis: { Axis: number, Positive: boolean } | null
};

export class Controller {
  private static instance: Controller | null = null;
  public static get Instance(): Controller { return this.instance || (this.instance = new Controller()); }
  public static Destroy(): void { this.instance = null; }

  private keyboard = {};
  private controlMap = new Map<Controls, ControlConfig>([
    [Controls.Pause, { Key: Keys.Escape, GamepadButton: 9, GamepadAxis: null }],
    [Controls.Up, { Key: Keys.ArrowUp, GamepadButton: null, GamepadAxis: { Axis: 1, Positive: false } }],
    [Controls.Down, { Key: Keys.ArrowDown, GamepadButton: null, GamepadAxis: { Axis: 1, Positive: true } }],
    [Controls.Left, { Key: Keys.ArrowLeft, GamepadButton: null, GamepadAxis: { Axis: 0, Positive: false } }],
    [Controls.Right, { Key: Keys.ArrowRight, GamepadButton: null, GamepadAxis: { Axis: 0, Positive: true } }],
    [Controls.ThrustUp, { Key: Keys.W, GamepadButton: null, GamepadAxis: { Axis: 1, Positive: false } }],
    [Controls.ThrustDown, { Key: Keys.S, GamepadButton: null, GamepadAxis: { Axis: 1, Positive: true } }],
    [Controls.ThrustLeft, { Key: Keys.A, GamepadButton: null, GamepadAxis: { Axis: 0, Positive: false } }],
    [Controls.ThrustRight, { Key: Keys.D, GamepadButton: null, GamepadAxis: { Axis: 0, Positive: true } }],
    [Controls.RotateLeft, { Key: Keys.ArrowLeft, GamepadButton: null, GamepadAxis: { Axis: 2, Positive: false } }],
    [Controls.RotateRight, { Key: Keys.ArrowRight, GamepadButton: null, GamepadAxis: { Axis: 2, Positive: true } }],
    [Controls.Pause, { Key: Keys.Escape, GamepadButton: 9, GamepadAxis: null }],
    [Controls.Fire, { Key: Keys.Space, GamepadButton: 6, GamepadAxis: null }]
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
    } else if (this.gamepad && config.GamepadButton) {
      controllerValue = this.gamepad.buttons[config.GamepadButton].value;
    }

    return Math.abs(controllerValue);
  }

  private handlePauseButton() {
    if (this.GetControlValue(Controls.Pause)) {
      this.game.TogglePause();
      this.game.GlobalEvent.Discontinue();

      setTimeout(() => {
        this.game.GlobalEvent.Reinstate();
      }, 250);
    }
  }
}
