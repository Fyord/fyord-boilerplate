import { Strings } from 'tsbase/Functions/Strings';
import { Queryable } from 'tsbase/Collections/Queryable';
import {
  Asap, ParseJsx, RawHtml, Character, GetPositionChangeFromDistanceAndAngle,
  PlayAudio, Position, StartingSizeAndPosition
} from 'fyord-game-engine';
import { Images, CharacterTypes, Sounds } from '../../../enums/module';
import { asteroidSprites } from './sprites';
import styles from './asteroid.module.scss';

export class Asteroid extends Character {
  public static Asteroids = new Array<Asteroid>();
  protected asteroidImmunity = false;
  private minimalWidth = 35;
  private globalCollisionEventRef = Strings.Empty;
  private localCollisionEventRef = Strings.Empty;

  constructor(private startingSizeAndPosition?: StartingSizeAndPosition, private velocity = 1) {
    super(startingSizeAndPosition);
  }

  Template = async () => {
    Asteroid.Asteroids.push(this);

    Asap(() => {
      this.CharacterType = CharacterTypes.Asteroid;
      this.HitBox = { radius: (() => this.Size.width / 2)(), offset: -10 };
      this.Angle = this.startingSizeAndPosition?.angle || Queryable.From([5, 65, 125, 185, 245, 305, 365]).GetRandom() as number;

      this.globalCollisionEventRef = this.game.CollisionEvent.Subscribe(() => {
        const positionChange = GetPositionChangeFromDistanceAndAngle(this.velocity, this.Angle);
        this.Position = { x: this.Position.x + positionChange.x, y: this.Position.y + positionChange.y };
      });

      this.localCollisionEventRef = this.Collision.Subscribe((character: Character | undefined) => {
        if (character && !(character.CharacterType === CharacterTypes.Asteroid && this.asteroidImmunity)) {
          this.explode(character);
        }
      });
    });

    return <div class={`${styles.asteroid} ${styles[Queryable.From(['left', 'right']).GetRandom() as string]}`}>
      {await new RawHtml(Queryable.From(asteroidSprites).GetRandom() as string, false).Render()}
    </div>;
  }

  Disconnected = () => {
    this.Collision.Cancel(this.localCollisionEventRef);
    this.game.CollisionEvent.Cancel(this.globalCollisionEventRef);
  }

  private explode = (character: Character): void => {
    this.Disconnected();

    this.game.Animation(() => {
      this.HitBox = null;
      PlayAudio(Sounds.MissileExplosion);
      (this.Element!.firstChild as HTMLDivElement).innerHTML = `<img src=${Images.MissileExplosion} alt="Explosion" />`;

      const shouldFracture = this.Size.width >= this.minimalWidth &&
        character.CharacterType !== CharacterTypes.Planet &&
        character.CharacterType !== CharacterTypes.Wormhole;

      if (shouldFracture) {
        this.spawnFracturedAsteroids(this.Position);
      }
    }, () => {
      Asteroid.Asteroids.splice(Asteroid.Asteroids.indexOf(this), 1);
      this.Element?.remove();
    }, 1000, false);
  }

  private spawnFracturedAsteroids(startingPosition: { x: number; y: number; }) {
    const startingPositions: Array<Position> = [
      startingPosition,
      { x: startingPosition.x + this.Size.width / 4, y: startingPosition.y },
      { x: startingPosition.x + this.Size.width / 8, y: startingPosition.y + this.Size.height / 4 }
    ];

    for (let i = 0; i < 3; i++) {
      this.spawnAsteroid(startingPositions, i);
    }
  }

  private spawnAsteroid = (startingPositions: Array<Position>, i: number) => {
    const asteroid = new Asteroid();

    asteroid.AddToLevel(() => {
      asteroid.Size = { height: this.Size.height / 2, width: this.Size.width / 2 };
      asteroid.Position = startingPositions[i];
      asteroid.velocity = this.velocity > 1 ? this.velocity : 1;
      asteroid.asteroidImmunity = true;

      setTimeout(() => {
        asteroid.asteroidImmunity = false;
      }, 1500);
    });
  }
}
