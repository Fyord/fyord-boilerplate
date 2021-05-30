import { CharacterTypes, Images, Sounds } from '../../../enums/module';
import { Character, Game, Utility } from '../../../core/module';
import { WormholeCharacter } from '../../module';
import { Player } from './player';
import { Router } from 'fyord';

const handleDestructionCollision = (player: Player): void => {
  Game.Instance.Animation(() => {
    player.SpriteContainer.innerHTML = /*html*/ `<img src="${Images.ShipExplosion}" alt="explosion">`;
    Utility.Instance.PlayAudio(Sounds.ShipExplosion);
  }, () => {
    player.Spawn();
  }, 1000);
};

const handleWormholeCollision = (player: Player, wormhole: WormholeCharacter): void => {
  Game.Instance.Animation(() => {
    player.style.transition = 'all 3s';
    player.Position = {
      x: wormhole.Position.x + wormhole.Size.width / 2,
      y: wormhole.Position.y + wormhole.Size.width / 2
    };
    player.Size = { width: 5, height: 5 };
    Utility.Instance.PlayAudio(Sounds.Wormhole);
    player.style.transform = 'rotate(5000deg)';
  }, () => {
    const route = (wormhole as WormholeCharacter).route;
    Router.Instance().RouteTo(route, true);
  }, 3000);
};

export type CollisionFunction = (player: Player, character?: Character) => void;

export const PlayerCollisionMap = new Map<CharacterTypes, CollisionFunction>([
  [CharacterTypes.Asteroid, (player: Player) => handleDestructionCollision(player)],
  // [CharacterTypes.Planet, (player: PlayerCharacter) => handleDestructionCollision(player)],
  // [CharacterTypes.Missile, (player: PlayerCharacter) => handleDestructionCollision(player)],
  [CharacterTypes.Wormhole, (player: Player, wormhole?: Character) => handleWormholeCollision(player, wormhole as WormholeCharacter)]
]);
