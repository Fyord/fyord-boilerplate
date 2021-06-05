import { Route, ParseJsx } from 'fyord-game-engine';
import { Asteroid } from '../../../characters/asteroids/asteroid/asteroid';
import { Player } from '../../../characters/asteroids/player/player';
import { Images, Routes } from '../../../enums/module';
import { AsteroidsLevel } from '../AsteroidsLevel';

export class LevelTwo extends AsteroidsLevel {
  Title = 'Level Two';

  Route = async (route: Route) => route.path == Routes.LevelTwo;
  Template = async () => {
    this.Background = Images.BackgroundBlue;
    this.WormholeDestination = Routes.LevelThree;

    return <div>
      {await new Player().Render()}

      {await new Asteroid({
        height: 200,
        width: 200,
        centered: true
      }).Render()}
    </div>;
  }
}
