import { ParseJsx, Page, RenderModes, Route } from 'fyord';
import styles from './not-found.module.scss';

export class NotFoundPage extends Page {
  Title = 'Not Found';

  RenderMode = RenderModes.Dynamic;
  Route = () => true;

  Html = async (route?: Route) => {
    return <div>
      <h1 class={styles.red}>{this.Title}</h1>

      <p>Could not find content matching, {decodeURI(route?.path || '')}"</p>
      <p>Please check spelling. Otherwise the resource may have been moved.</p>
    </div>;
  }
}
