import { Strings } from 'tsbase/Functions/Strings';
import { Asap, ParseJsx } from 'fyord';
import { Controller, Position, Character, GetPositionChangeFromDistanceAndAngle } from '../../../core/module';
import { Controls, CharacterTypes } from '../../../enums/module';
import { CollisionFunction, PlayerCollisionMap } from './collisionMap';
import { playerSprite } from './sprite';
import styles from './player.module.scss';
import { Missile } from '../missile/missile';

export const playerIds = {
  spriteContainer: 'spriteContainer'
};

const defaultSize = { height: 40, width: 40 };
const defaultHitBox = { radius: 0, offset: 0 };

export class Player extends Character {
  Template = async () => <div id={playerIds.spriteContainer} class={`${styles.player} ${CharacterTypes.Player}`}>{playerSprite}</div>;

  public static StartingPosition: Position = { x: 20, y: 20 };

  public get SpriteContainer(): HTMLDivElement {
    return document.getElementById(playerIds.spriteContainer) as HTMLDivElement;
  }
  private missileReady = true;
  private missileCoolDown = 200;
  private playerControlsRef = Strings.Empty;

  constructor(private controller = Controller.Instance) {
    super();

    Asap(() => {
      this.CharacterType = CharacterTypes.Player;
      this.Size = defaultSize;
      this.Spawn();

      this.playerControlsRef = this.game.PlayerControls.Subscribe(() => this.handleGamepadEvent());

      this.Collision.Subscribe((character: Character | undefined) => {
        if (character && PlayerCollisionMap.has(character.CharacterType)) {
          (PlayerCollisionMap.get(character.CharacterType) as CollisionFunction)(this, character);
        }
      });
    });
  }

  Disconnected = () => {
    this.game.PlayerControls.Cancel(this.playerControlsRef);
  }

  public Spawn = (): void => {
    this.SpriteContainer.innerHTML = playerSprite;
    this.HitBox = null;
    this.Position = Player.StartingPosition;
    this.Element!.style.opacity = '50%';
    this.Element!.style.zIndex = '99';

    setTimeout(() => {
      if (this.Element) {
        this.HitBox = defaultHitBox;
        this.Element.style.opacity = '100%';
      }
    }, 1000);
  }

  private handleGamepadEvent = (): void => {
    if (this.Element) {
      this.handleSteeringControls();
      this.handleVerticalThrust();
      this.handleHorizontalThrust();

      if (this.missileReady && this.controller.GetControlValue(Controls.Fire)) {
        this.missileReady = false;
        const missile = new Missile();
        missile.AddToLevel(() => {
          const missileAngle = this.Angle - 180;
          const launchOffset = GetPositionChangeFromDistanceAndAngle(this.Size.width, missileAngle);
          missile.Angle = missileAngle;
          missile.Position = { x: this.Position.x + launchOffset.x, y: this.Position.y + launchOffset.y };
        });

        setTimeout(() => {
          this.missileReady = true;
        }, this.missileCoolDown);
      }
    }
  }

  private handleSteeringControls = (): void => {
    const rotationValue = (this.controller.GetControlValue(Controls.RotateRight) -
      this.controller.GetControlValue(Controls.RotateLeft)) * 5;

    if (Math.abs(rotationValue) > .5) {
      const proposedRotation = this.Angle + rotationValue;
      // eslint-disable-next-line no-nested-ternary
      this.Angle = Math.abs(proposedRotation) <= 360 ?
        proposedRotation :
        (proposedRotation > 0 ? proposedRotation - 360 : proposedRotation + 360);
    }
  }

  private handleVerticalThrust = (): void => {
    const angleToDirection = this.Angle;
    const thrustValue = this.controller.GetControlValue(Controls.ThrustDown) -
      this.controller.GetControlValue(Controls.ThrustUp);
    const cValue = thrustValue < 0 ? thrustValue * 5 : thrustValue;

    const shouldMove = Math.abs(cValue) > .5;

    if (Math.abs(angleToDirection) > 0 && shouldMove) {
      this.applyThrustAtAngle(cValue, angleToDirection);
    } else if (shouldMove) {
      this.updatePosition(0, cValue);
    }
  }

  private handleHorizontalThrust = (): void => {
    const angleToDirection = this.Angle + 90;
    const thrustValue = (this.controller.GetControlValue(Controls.ThrustRight) -
      this.controller.GetControlValue(Controls.ThrustLeft)) * -2;
    const shouldMove = Math.abs(thrustValue) > .5;

    if (Math.abs(angleToDirection) > 0 && shouldMove) {
      this.applyThrustAtAngle(thrustValue, angleToDirection);
    } else if (shouldMove) {
      this.updatePosition(thrustValue, 0);
    }
  }

  private applyThrustAtAngle = (thrustValue: number, angle: number): void => {
    const positionChange = GetPositionChangeFromDistanceAndAngle(thrustValue, angle);
    this.updatePosition(positionChange.y, positionChange.x);
  }

  private updatePosition = (yChange: number, xChange: number) => {
    const newXValue = this.Position.x + xChange;
    const newYValue = this.Position.y + yChange;

    this.Position = { x: newXValue, y: newYValue };
  }
}
