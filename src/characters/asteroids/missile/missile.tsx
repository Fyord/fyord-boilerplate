import { Strings } from 'tsbase/Functions/Strings';
import { Asap, ParseJsx, Character, GetPositionChangeFromDistanceAndAngle, PlayAudio, Position } from 'fyord-game-engine';
import { CharacterTypes, Images, Sounds } from '../../../enums/module';
import styles from './missile.module.scss';

const keys = {
  missileImage: 'missileImage'
};

export class Missile extends Character {
  private globalCollisionEventRef = Strings.Empty;
  private localCollisionEventRef = Strings.Empty;

  Template = async () => <div class={styles.missile}>
    <img id={this.Ids(keys.missileImage)} src={Images.Missile} alt="Missile" />
  </div>;

  private pixelsPerFrame = 6;
  private fuel: number;

  private get nose(): Position {
    return { x: this.Position.x + this.Size.width / 2, y: this.Position.y + this.Size.height / 2 };
  }

  constructor() {
    super({
      height: 40,
      width: 40
    });

    this.fuel = this.game.MapBounds.maxX;

    Asap(() => {
      this.CharacterType = CharacterTypes.Missile;
      this.HitBox = { radius: 0, offset: 0 };

      PlayAudio(Sounds.Launch);

      this.globalCollisionEventRef = this.game.CollisionEvent.Subscribe(() => {
        if (this.Element) {

          if (this.fuel >= this.pixelsPerFrame) {
            const positionChange = GetPositionChangeFromDistanceAndAngle(this.pixelsPerFrame, this.Angle);
            this.Position = { x: this.Position.x + positionChange.x, y: this.Position.y + positionChange.y };
            this.fuel -= this.pixelsPerFrame;
          } else {
            this.detonate();
          }
        }
      });

      this.localCollisionEventRef = this.Collision.Subscribe((character: Character | undefined) => {
        this.detonate();

        if (character && character.HitBox) {
          character.Collision.Publish(this);
        }
      });
    });
  }

  Disconnected = () => {
    this.game.CollisionEvent.Cancel(this.globalCollisionEventRef);
    this.Collision.Cancel(this.localCollisionEventRef);
  }

  public GetHitPoints(): Array<Position> {
    const offset = GetPositionChangeFromDistanceAndAngle(this.pixelsPerFrame - 3, this.Angle);

    return [
      this.nose,
      { x: this.nose.x + offset.x, y: this.nose.y + offset.y }
    ];
  }

  public GetCharacterBounds() {
    return null;
  }

  private detonate = (): void => {
    this.Disconnected();

    this.game.Animation(() => {
      PlayAudio(Sounds.MissileExplosion);

      const missileImage = document.getElementById(this.Ids(keys.missileImage)) as HTMLImageElement;
      missileImage.src = Images.MissileExplosion;
    }, () => {
      if (this.Element) {
        this.Element.remove();
      }
    }, 1000, false);
  }
}
