import { Asap, Character, ParseJsx } from 'fyord-game-engine';
import { Images, CharacterTypes, Routes } from '../../../enums/module';
import styles from './wormhole.module.scss';

export class Wormhole extends Character {
  public Route: Routes = Routes.LevelOne;

  Template = async () => <div class={`${CharacterTypes.Wormhole} ${styles.wormhole}`}>
    <img src={Images.Wormhole} alt="Wormhole" />
  </div>;

  constructor() {
    super({
      height: 80,
      width: 80
    });

    Asap(() => {
      this.CharacterType = CharacterTypes.Wormhole;
      this.HitBox = { radius: (() => this.Size.width / 2)(), offset: 0 };
    });
  }
}
