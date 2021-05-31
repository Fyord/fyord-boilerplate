import { Asap, ParseJsx, RawHtml } from 'fyord';
import { CharacterTypes } from '../../../enums/module';
import { Character, StartingSizeAndPosition } from '../../../core/module';
import { planetSprite } from './sprite';
import styles from './planet.module.scss';

export class Planet extends Character {
  Template = async () => <div class={styles.planet}>{await new RawHtml(planetSprite, false).Render()}</div>;

  constructor(startingSizeAndPosition: StartingSizeAndPosition) {
    super(startingSizeAndPosition);

    Asap(() => {
      this.CharacterType = CharacterTypes.Planet;
      this.HitBox = { radius: (() => this.Size.width / 2)(), offset: -10 };
    });
  }
}
