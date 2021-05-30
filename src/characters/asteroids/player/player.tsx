import { Strings } from 'tsbase/Functions/Strings';
import { Controller, Position, Character } from '../../../core/module';
import { Controls, CharacterTypes, Selectors } from '../../enums/module';
import { CollisionFunction, PlayerCollisionMap } from './PlayerCollisionMap';
import { playerSprite } from './sprite';

export const playerIds = {
  spriteContainer: 'spriteContainer'
};

const defaultSize = { height: 40, width: 40 };
const defaultHitBox = { radius: 0, offset: 0 };

export class Player extends Character {
  public static StartingPosition: Position = { x: 20, y: 20};

  public get SpriteContainer(): HTMLDivElement {
    return document.getElementById(playerIds.spriteContainer) as HTMLDivElement;
  }
  private missileReady = true;
  private missileCoolDown = 200;
  private gamepadEventRef = Strings.Empty;
  private collisionEventRef = Strings.Empty;

  constructor(private controller = Controller.Instance) {
    super();

    this.InitAttributes(() => {
      this.CharacterType = CharacterTypes.Player;
      this.Size = defaultSize;
      this.Spawn();
    });
  }

  protected template = (): string => /*html*/ `
    <div id="${playerIds.spriteContainer}" class="player-character">${playerSprite}</div>`;

  protected onPostRender = (): void => {
    this.gamepadEventRef = this.game.ShipControlsEvent.Subscribe(() => this.handleGamepadEvent());

    this.collisionEventRef = this.Collision.Subscribe((character: Character | undefined) => {
      if (character && PlayerCollisionMap.has(character.CharacterType)) {
        (PlayerCollisionMap.get(character.CharacterType) as CollisionFunction)(this, character);
      }
    });
  }

  public disconnectedCallback(): void {
    this.game.ShipControlsEvent.Cancel(this.gamepadEventRef);
    this.game.CollisionEvent.Cancel(this.collisionEventRef);
  }

  public Spawn = (): void => {
    this.SpriteContainer.innerHTML = playerSprite;
    this.HitBox = null;
    this.Position = Player.StartingPosition;
    this.style.opacity = '50%';

    setTimeout(() => {
      this.HitBox = defaultHitBox;
      this.style.opacity = '100%';
    }, 1000);
  }

  private handleGamepadEvent = (): void => {
    this.handleSteeringControls();
    this.handleVerticalThrust();
    this.handleHorizontalThrust();

    if (this.missileReady && this.controller.GetControlValue(Controls.Fire)) {
      this.missileReady = false;

      const missile = document.createElement(Selectors.Missile) as MissileCharacter;
      missile.InitAttributes(() => {
        const missileAngle = this.Angle - 180;
        const launchOffset = this.utility.GetPositionChangeFromDistanceAndAngle(this.Size.width, missileAngle);
        missile.Angle = missileAngle;
        missile.Position = { x: this.Position.x + launchOffset.x, y: this.Position.y + launchOffset.y };
      });
      this.parentElement?.appendChild(missile);

      setTimeout(() => {
        this.missileReady = true;
      }, this.missileCoolDown);
    }
  }

  private handleSteeringControls = (): void => {
    const rotationValue = (this.controller.GetControlValue(Controls.RotateRight) -
      this.controller.GetControlValue(Controls.RotateLeft)) * 5;

    if (Math.abs(rotationValue) > .5) {
      const proposedRotation = this.Angle + rotationValue;
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
    const positionChange = this.utility.GetPositionChangeFromDistanceAndAngle(thrustValue, angle);
    this.updatePosition(positionChange.y, positionChange.x);
  }

  private updatePosition = (yChange: number, xChange: number) => {
    const newXValue = this.Position.x + xChange;
    const newYValue = this.Position.y + yChange;

    this.Position = { x: newXValue, y: newYValue };
  }
}
