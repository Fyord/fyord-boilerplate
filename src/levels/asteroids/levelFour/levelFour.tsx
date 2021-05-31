import { Route, ParseJsx } from 'fyord';
import { Asteroid } from '../../../characters/asteroids/asteroid/asteroid';
import { Player } from '../../../characters/asteroids/player/player';
import { Images, Routes } from '../../../enums/module';
import { AsteroidsLevel } from '../AsteroidsLevel';

export class LevelFour extends AsteroidsLevel {
  Title = 'Level Four';
  Route = async (route: Route) => route.path === Routes.LevelFour;
  Template = async () => {
    this.Background = Images.BackgroundGreen;
    this.WormholeDestination = Routes.Victory;

    return <div>
      {await new Player().Render()}

      {await new Asteroid({
        height: 150,
        width: 150,
        centered: true
      }, 5).Render()}
    </div>;
  }
}
