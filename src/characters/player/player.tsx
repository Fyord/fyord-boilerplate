import { ParseJsx, Asap } from 'fyord';
import { Strings } from 'tsbase/Functions/Strings';
import { Character, Controller } from '../../core/module';
import { CharacterTypes, Controls } from '../../enums/module';
import styles from './player.module.scss';

export class Player extends Character {
  CharacterType = CharacterTypes.Player;
  Template = async () => <div class={styles.player}></div>;

  private playerControlsRef = Strings.Empty;

  constructor(
    private controller = Controller.Instance
  ) {
    super();

    Asap(() => {
      this.Size = { height: 40, width: 40 };

      this.playerControlsRef = this.game.PlayerControls.Subscribe(() => {
        const upValue = this.controller.GetControlValue(Controls.Up);
        const downValue = this.controller.GetControlValue(Controls.Down);
        const leftValue = this.controller.GetControlValue(Controls.Left);
        const rightValue = this.controller.GetControlValue(Controls.Right);

        this.Position = {
          x: this.Position.x + (rightValue - leftValue) * 5,
          y: this.Position.y + (downValue - upValue) * 5
        };
      });
    });
  }

  Disconnected = () => {
    this.game.PlayerControls.Cancel(this.playerControlsRef);
  }
}
