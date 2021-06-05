import { Route, ParseJsx, Level } from 'fyord-game-engine';
import { Player } from '../../characters/asteroids/player/player';
import { Routes } from '../../enums/Routes';
import styles from './levelOne.module.scss';

export class LevelOne extends Level {
  Title = 'Level One';
  Route = async (route: Route) => route.path === Routes.LevelOne;
  Template = async () =>
    <div class={styles.levelOne}>
      {await new Player().Render()}
    </div>;
}
