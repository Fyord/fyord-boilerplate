import { ParseJsx } from 'fyord';
import { Images, CharacterTypes } from '../../../enums/module';
import { Character } from '../../../core/module';
import styles from './wormhole.module.scss';

export class WormholeCharacter extends Character {
  CharacterType = CharacterTypes.Wormhole;
  HitBox = { radius: (() => this.Size.width / 2)(), offset: 0 };

  Template = async () => <div class={`${CharacterTypes.Wormhole} ${styles.wormhole}`}>
    <img src={Images.Wormhole} alt="Wormhole" />
  </div>;

  constructor(public Route: string) {
    super();
  }
}
