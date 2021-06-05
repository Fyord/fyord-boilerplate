import { Route, ParseJsx } from 'fyord-game-engine';
import { Asteroid } from '../../../characters/asteroids/asteroid/asteroid';
import { Planet } from '../../../characters/asteroids/planet/planet';
import { Player } from '../../../characters/asteroids/player/player';
import { Images, Routes } from '../../../enums/module';
import { AsteroidsLevel } from '../AsteroidsLevel';

export class LevelOne extends AsteroidsLevel {
  Title = 'Level One';
  Route = async (route: Route) => route.path === Routes.LevelOne;
  Template = async () => {
    this.Background = Images.BackgroundPurple;
    this.WormholeDestination = Routes.LevelTwo;

    const planetDiameter = (innerHeight > innerWidth ? innerWidth : innerHeight) / 2.5;

    return <div>
      {await new Player().Render()}

      {await new Asteroid({
        height: 60,
        width: 60,
        xpos: this.game.MapBounds.maxX - 120,
        ypos: this.game.MapBounds.maxY / 20
      }, 0).Render()}

      {await new Planet({
        height: planetDiameter,
        width: planetDiameter,
        centered: true
      }).Render()}

      {await new Asteroid({
        height: 110,
        width: 110,
        xpos: this.game.MapBounds.maxX / 20,
        ypos: this.game.MapBounds.maxY / 3
      }, 0).Render()}
    </div>;
  }
}
