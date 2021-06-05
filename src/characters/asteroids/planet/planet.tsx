import { Asap, Character, ParseJsx, RawHtml, StartingSizeAndPosition } from 'fyord-game-engine';
import { CharacterTypes } from '../../../enums/module';
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
