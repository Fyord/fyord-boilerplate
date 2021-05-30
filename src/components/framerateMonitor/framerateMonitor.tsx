import { Component, ParseJsx, State } from 'fyord';
import { Game } from '../../core/module';
import styles from './framerateMonitor.module.css';

export class FramerateMonitor extends Component {
  @State private framerate = 0;
  Template = async () => <div class={styles.framerate}>{this.framerate}</div>;

  constructor(game = Game.Instance) {
    super();

    game.GameLoop.Framerate.Subscribe(framerate => {
      this.framerate = framerate || 0;
    });
  }
}
