import { Asap, Component } from 'fyord';
import { Observable } from 'tsbase/Patterns/Observable/Observable';
import { CharacterTypes } from '../../enums/CharacterTypes';
import { Game } from '../game/game';
import { HitBox, Position, Size, StartingSizeAndPosition } from '../types';
import { Utility } from '../utility/utility';

export abstract class Character extends Component {
  private angle: number = 0;
  public get Angle(): number {
    return this.angle;
  }
  public set Angle(v: number) {
    this.angle = v;
    this.Element!.style.transform = `rotate(${v}deg)`;
  }

  private size: Size = { height: 0, width: 0 };
  public get Size(): Size {
    return this.size;
  }
  public set Size(v: Size) {
    this.size = v;
    this.Element!.style.height = `${v.height}px`;
    this.Element!.style.width = `${v.width}px`;
  }

  private position: Position = { x: 0, y: 0 };
  public get Position(): Position {
    return this.position;
  }
  public set Position(v: Position) {
    const mapBounds = Game.Instance.MapBounds;
    const offset = this.Size.width > this.Size.height ? this.Size.width : this.Size.height;
    let newX = v.x;
    let newY = v.y;

    if (v.x < mapBounds.minX) {
      newX = mapBounds.minX;
    } else if (v.x > mapBounds.maxX - offset) {
      newX = mapBounds.maxX - offset;
    }

    this.position.x = newX;
    this.Element!.style.left = `${newX}px`;
    this.Element!.style.left = `${newX}px`;

    if (v.y < mapBounds.minY) {
      newY = mapBounds.minY;
    } else if (v.y > mapBounds.maxY - offset) {
      newY = mapBounds.maxY - offset;
    }

    this.position.y = newY;
    this.Element!.style.top = `${newY}px`;
    this.Element!.style.top = `${newY}px`;
  }

  public CharacterType = CharacterTypes.Other;
  public HitBox: HitBox = null;
  public Collision = new Observable<Character>();

  constructor(
    startingSizeAndPosition?: StartingSizeAndPosition,
    protected game = Game.Instance,
    protected utility = Utility.Instance
  ) {
    super();

    Asap(() => {
      this.game.Characters.push(this);
      this.Element!.style.position = 'absolute';
      this.Size = { width: this.intOrDefault(startingSizeAndPosition?.width), height: this.intOrDefault(startingSizeAndPosition?.height) };
      this.Position = startingSizeAndPosition?.centered ?
        {
          x: (this.game.MapBounds.maxX / 2) - (this.Size.width / 2),
          y: (this.game.MapBounds.maxY / 2) - (this.Size.height / 2)
        } :
        { x: this.intOrDefault(startingSizeAndPosition?.xpos), y: this.intOrDefault(startingSizeAndPosition?.ypos) };
      this.Angle = this.intOrDefault(startingSizeAndPosition?.angle);
    });
  }

  public GetHitPoints(): Array<Position> {
    return [
      { x: this.Position.x, y: this.Position.y }, // top left
      { x: this.Position.x + this.Size.width / 2, y: this.Position.y }, // top middle
      { x: this.Position.x + this.Size.width, y: this.Position.y }, // top right
      { x: this.Position.x, y: this.Position.y + this.Size.height / 2 }, // middle left
      { x: this.Position.x + this.Size.width / 2, y: this.Position.y + this.Size.height / 2 }, // middle middle
      { x: this.Position.x + this.Size.width, y: this.Position.y + this.Size.height / 2 }, // middle right
      { x: this.Position.x, y: this.Position.y + this.Size.height }, // bottom left
      { x: this.Position.x + this.Size.width / 2, y: this.Position.y + this.Size.height }, // bottom middle
      { x: this.Position.x + this.Size.width, y: this.Position.y + this.Size.height } // bottom right
    ];
  }

  public GetCharacterBounds(): { xBounds: { l: number, r: number }, yBounds: { b: number, t: number } } | null {
    return {
      xBounds: { l: this.Position.x, r: this.Position.x + this.Size.width },
      yBounds: { b: this.Position.y, t: this.Position.y + this.Size.height }
    };
  }

  private intOrDefault = (value?: number) => {
    return value || 0;
  }
}
