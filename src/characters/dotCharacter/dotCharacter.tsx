import { ParseJsx, Asap } from 'fyord';
import { Character, Controller, StartingSizeAndPosition } from '../../core/module';
import { CharacterTypes, Controls } from '../../enums/module';
import styles from './dotCharacter.module.scss';

export class DotCharacter extends Character {
  CharacterType = CharacterTypes.Player;

  Template = async () => <div class={styles.dotCharacterComponent}></div>;

  constructor(
    startingSizeAndPosition?: StartingSizeAndPosition,
    private controller = Controller.Instance
  ) {
    super(startingSizeAndPosition);

    this.InitAttributes(() => {
      this.Size = { height: 40, width: 40 };
    });

    Asap(() => {
      this.game.PlayerControls.Subscribe(() => {
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
}
