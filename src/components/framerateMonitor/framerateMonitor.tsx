import { Component, Game, ParseJsx, State } from 'fyord-game-engine';
import styles from './framerateMonitor.module.scss';

export class FramerateMonitor extends Component {
  @State private framerate = 0;

  private colorClass = () => {
    let colorClass = styles.green;

    if (this.framerate < Game.TargetFramerate) {
      colorClass = styles.yellow;
    }

    if (this.framerate <= Game.TargetFramerate / 1.5) {
      colorClass = styles.red;
    }

    return colorClass;
  }

  Template = async () => <div class={`${styles.framerate} ${this.colorClass()}`}>{this.framerate}</div>;

  constructor(game = Game.Instance) {
    super();

    game.GameLoop.Framerate.Subscribe(framerate => {
      this.framerate = framerate || 0;
    });
  }
}
