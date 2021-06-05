import { CharacterTypes, Images, Sounds } from '../../../enums/module';
import { Character, Game, PlayAudio } from '../../../core/module';
import { Wormhole } from '../wormhole/wormhole';
import { Player } from './player';
import { Router } from 'fyord';

const handleDestructionCollision = (player: Player): void => {
  Game.Instance.Animation(() => {
    player.SpriteContainer.innerHTML = /*html*/ `<img src="${Images.ShipExplosion}" alt="explosion">`;
    PlayAudio(Sounds.ShipExplosion);
  }, () => {
    player.Spawn();
  }, 1000);
};

const handleWormholeCollision = (player: Player, wormhole: Wormhole): void => {
  Game.Instance.Animation(() => {
    player.Element!.style.transition = 'all 3s';
    player.Position = {
      x: wormhole.Position.x + wormhole.Size.width / 2,
      y: wormhole.Position.y + wormhole.Size.width / 2
    };
    player.Size = { width: 5, height: 5 };
    PlayAudio(Sounds.Wormhole);
    player.Element!.style.transform = 'rotate(5000deg)';
  }, () => {
    Router.Instance().RouteTo(wormhole.Route, true);
  }, 3000);
};

export type CollisionFunction = (player: Player, character?: Character) => void;

export const PlayerCollisionMap = new Map<string, CollisionFunction>([
  [CharacterTypes.Asteroid, (player: Player) => handleDestructionCollision(player)],
  [CharacterTypes.Planet, (player: Player) => handleDestructionCollision(player)],
  [CharacterTypes.Missile, (player: Player) => handleDestructionCollision(player)],
  [CharacterTypes.Wormhole, (player: Player, wormhole?: Character) => handleWormholeCollision(player, wormhole as Wormhole)]
]);
