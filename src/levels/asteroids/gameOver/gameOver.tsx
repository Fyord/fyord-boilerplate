import { ParseJsx, Route, Fragment } from 'fyord';
import { Strings } from 'tsbase/Functions/Strings';
import { Asteroid } from '../../../characters/asteroids/asteroid/asteroid';
import { Images } from '../../../enums/module';
import { AsteroidsLevel } from '../AsteroidsLevel';
import styles from './gameOver.module.scss';

export class GameOver extends AsteroidsLevel {
  private victory = false;
  private victoryMessage = 'Congratulations! You did it!';
  private defeatMessage = 'Better luck next time...';

  Route = async (route: Route) => {
    if (route.path.startsWith('/game-over') && route.routeParams.length === 2) {
      const condition = route.routeParams[1];

      if (condition === 'victory' || condition === 'defeat') {
        this.victory = condition === 'victory';
        this.Title = Strings.PascalCase(condition);

        return true;
      }
    }

    return false;
  }

  Template = async () => {
    this.Background = Images.BackgroundGreen;

    return <>
      <div class={styles.container}>
        <h1>{this.Title}</h1>
        <p>{this.victory ? this.victoryMessage : this.defeatMessage}</p>

        <div>
          <a href="/">Play Again</a>
        </div>
      </div>

      {await new Asteroid({
        height: 200,
        width: 200,
        centered: true,
        angle: 45
      }, 6).Render()}
    </>;
  }
}
