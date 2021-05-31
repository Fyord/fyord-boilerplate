import { Route, ParseJsx } from 'fyord';
import { Asteroid } from '../../../characters/asteroids/asteroid/asteroid';
import { Player } from '../../../characters/asteroids/player/player';
import { Images, Routes } from '../../../enums/module';
import { AsteroidsLevel } from '../AsteroidsLevel';

export class LevelThree extends AsteroidsLevel {
  Title = 'Level Three';
  Route = async (route: Route) => route.path === Routes.LevelThree;
  Template = async () => {
    this.Background = Images.BackgroundSpiral;
    this.WormholeDestination = Routes.LevelFour;

    return <div>
      {await new Player().Render()}

      {await new Asteroid({
        height: 150,
        width: 150,
        xpos: 100,
        ypos: this.game.MapBounds.maxY / 2
      }, 1).Render()}

      {await new Asteroid({
        height: 150,
        width: 150,
        centered: true
      }, 1).Render()}

      {await new Asteroid({
        height: 150,
        width: 150,
        xpos: 100,
        ypos: this.game.MapBounds.maxX - 100
      }, 1).Render()}
    </div>;
  }
}
