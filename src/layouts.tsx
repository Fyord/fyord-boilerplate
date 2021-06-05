import { ParseJsx, Fragment } from 'fyord-game-engine';
import { FramerateMonitor, Menu } from './components/module';

export const defaultLayout = async () => <>
  {await new FramerateMonitor().Render()}
  {await new Menu().Render()}
  <main></main>
</>;
