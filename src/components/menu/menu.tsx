import { Component, ParseJsx, State, Fragment } from 'fyord';
import { Strings } from 'tsbase/Functions/Strings';
import { Game } from '../../core/module';
import { controlsSection } from '../controlsSection';
import styles from './menu.module.scss';

export class Menu extends Component {
  @State paused = false;

  constructor() {
    super();

    Game.Instance.Paused.Subscribe((isPaused) => {
      this.paused = isPaused || false;
    });
  }

  Template = async () => <>{this.paused ?
    <div class={styles.menu} id="menu">
      <p>Game Paused</p>
      {controlsSection}
    </div> : Strings.Empty}
  </>;
}