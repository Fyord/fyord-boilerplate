import { Strings } from 'tsbase/Functions/Strings';
import { Game, Level } from 'fyord-game-engine';
import { Asteroid } from '../../characters/asteroids/asteroid/asteroid';
import { Wormhole } from '../../characters/asteroids/wormhole/wormhole';
import { Routes, Images } from '../../enums/module';

export abstract class AsteroidsLevel extends Level {
  private wormholeDestination = Routes.LevelOne;
  private collisionEventRef = Strings.Empty;

  constructor(playable = true, protected game = Game.Instance) {
    super();

    this.App.Router.Route.Subscribe(async () => {
      this.collisionEventRef = Strings.Empty;

      if (playable && this.Element && !this.collisionEventRef) {
        this.spawnWormholeWhenAsteroidsCleared();
      }
    });
  }

  Disconnected = () => {
    this.game.CollisionEvent.Cancel(this.collisionEventRef);
  }

  protected set Background(v: Images) {
    document.body.style.backgroundImage = `url(${v})`;
  }

  protected set WormholeDestination(v: Routes) {
    this.wormholeDestination = v;
  }

  private spawnWormholeWhenAsteroidsCleared() {
    this.collisionEventRef = this.game.CollisionEvent.Subscribe(() => {
      if (Asteroid.Asteroids.filter(a => !!a.Element).length === 0) {
        this.game.CollisionEvent.Cancel(this.collisionEventRef);
        this.spawnWormHole();
      }
    });
  }

  private spawnWormHole = (): void => {
    const newWormHole = new Wormhole();
    newWormHole.Route = this.wormholeDestination;
    newWormHole.AddToLevel(() => {
      newWormHole.Position = { x: this.game.MapBounds.maxX - 120, y: this.game.MapBounds.maxY - 120 };
    });
  }
}
