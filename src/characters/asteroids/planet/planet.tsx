import { ParseJsx } from 'fyord';
import { CharacterTypes } from '../../../enums/module';
import { Character } from '../../../core/module';
import { planetSprite } from './sprite';
import styles from './planet.module.scss';

export class PlanetCharacterComponent extends Character {
  CharacterType = CharacterTypes.Planet;
  HitBox = { radius: (() => this.Size.width / 2)(), offset: -10 };
  Template = async () => <div class={styles.planet}>{planetSprite}</div>;
}
