import { Route, ParseJsx } from 'fyord';
import { Level } from '../../core/level/level';
import { DotCharacter } from '../../characters/module';
import { Routes } from '../../enums/Routes';
import styles from './levelOne.module.scss';

export class LevelOne extends Level {
  Title = 'Level One';
  Route = async (route: Route) => route.path === Routes.LevelOne;
  Template = async () =>
    <div class={styles.firstLevel}>
      {await new DotCharacter().Render()}
    </div>;
}
