import { ParseJsx, Fragment } from 'fyord';
import { FramerateMonitor } from './components/module';

export const defaultLayout = async () => <>
  {await new FramerateMonitor().Render()}

  <div class="menu" id="menu">
    <p>Game Paused</p>
  </div>

  <main></main>
</>;
