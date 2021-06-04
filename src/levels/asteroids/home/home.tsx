import { ParseJsx, Route, Fragment } from 'fyord';
import { Asteroid } from '../../../characters/asteroids/asteroid/asteroid';
import { controlsSection } from '../../../components/controlsSection';
import { Images } from '../../../enums/module';
import { Routes } from '../../../enums/Routes';
import { AsteroidsLevel } from '../AsteroidsLevel';
import styles from './home.module.scss';

export class Home extends AsteroidsLevel {
  Title = 'Home';
  Route = async (route: Route) => route.path === Routes.Home;

  Template = async () => {
    this.Background = Images.BackgroundPurple;

    return <>
      <div class={styles.container}>
        <section>
          <h1>Asteroids</h1>

          <p>Clear the asteroids on each level. A wormhole will appear after all asteroids are cleared to take you to the next level.</p>

          <div>
            <a href={Routes.LevelOne}>Start Game</a>
          </div>
        </section>

        {controlsSection}
      </div>

      {await new Asteroid({
        height: 100,
        width: 100,
        centered: true
      }, 3).Render()}

      {await new Asteroid({
        height: 100,
        width: 100,
        centered: true
      }, 3).Render()}

      {await new Asteroid({
        height: 100,
        width: 100,
        centered: true
      }, 3).Render()}
    </>;
  }
}
