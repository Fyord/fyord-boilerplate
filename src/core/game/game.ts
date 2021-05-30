import { GameLoop } from 'tsbase/Utility/Timers/GameLoop';
import { Observable } from 'tsbase/Patterns/Observable/Observable';
import { Sounds } from '../../enums/Sounds';
import { Utility } from '../utility/utility';
import { App } from 'fyord';
import { Character } from '../character/character';

export class Game {
  private static instance: Game | null = null;
  public static get Instance(): Game { return this.instance || (this.instance = new Game()); }
  public static Destroy(): void { this.instance = null; }

  public GameLoop = new GameLoop();
  public GlobalEvent = new Observable<any>();
  public PlayerControls = new Observable<any>();
  public CollisionEvent = new Observable<any>();
  public MapBounds = {
    minX: 0,
    minY: 0,
    maxX: 800,
    maxY: 600
  };
  private characters = new Array<Character>();
  public get Characters(): Array<Character> {
    this.characters = this.characters.filter(c => !!c.Element);
    return this.characters;
  }
  private paused = false;

  private constructor(
    private utility = Utility.Instance,
    private app = App.Instance()
  ) {
    this.GameLoop.GameEvents = [
      this.GlobalEvent,
      this.PlayerControls,
      this.CollisionEvent
    ];

    this.CollisionEvent.Subscribe(() => {
      this.utility.DetectCollisions(this.Characters);
    });

    this.app.Router.Route.Subscribe(async () => {
      this.app.Main.style.width = `${this.MapBounds.maxX}px`;
      this.app.Main.style.height = `${this.MapBounds.maxY}px`;
    });
  }

  public Animation = (immediate: () => void, delayed: () => void, milliseconds: number, pausing = true): void => {
    if (pausing) {
      this.PlayerControls.Discontinue();
      this.CollisionEvent.Discontinue();
    }

    immediate();

    setTimeout(() => {
      delayed();

      if (pausing && !this.paused) {
        this.resume();
      }
    }, milliseconds);
  }

  public TogglePause = (): void => {
    this.utility.PlayAudio(Sounds.Pause);
    const menuElement = document.getElementById('menu') as HTMLDivElement;

    if (this.paused) {
      this.resume();
      menuElement.style.display = 'none';
    } else {
      this.pause();
      menuElement.style.display = 'flex';
    }
  }

  private pause = (): void => {
    this.PlayerControls.Discontinue();
    this.CollisionEvent.Discontinue();
    this.paused = true;
  }

  private resume = (): void => {
    this.PlayerControls.Reinstate();
    this.CollisionEvent.Reinstate();
    this.paused = false;
  }
}
