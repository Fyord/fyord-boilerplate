export enum Snippets {
    Component = `export class HeaderComponent extends Component {
  private links = [
      { href: Routes.Home, label: 'Home' },
      { href: Routes.Examples, label: 'Examples' },
      { href: Routes.Styleguide, label: 'Styleguide' }
    ];

    Html = async () =>
      <header>
        <nav class={styles.nav}>
          <ul>
            {this.links.map((l, i) => <li key={i}>
              <a href={l.href}>{l.label}</a>
            </li>)}
          </ul>
        </nav>
      </header>;
}`,
  Routing = `export class RoutingExample extends Page {
  Route = (route: Route) => route.path === Routes.Routing;
  Html = async () =>
      <header>
          <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contact</a></li>
          </ul>
      </header>
}`,
  Styling = `import styles from './contact.module.css';

  Html = async () => {
    return <div>
      <h1 class={styles.red}>Contact me!</h1>
    </div>;
}`,
  State = `export class ChangeDetectionPage extends Page {
  @AppStore private userAge: number = 0;
  @State private counter: number = 0;

  Html = async () => {
    return <div>
        <p>User's Age: <b>{this.counter}</b></p>;
      </div>
}`
}
