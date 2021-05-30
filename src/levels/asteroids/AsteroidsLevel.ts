// import { Asap } from 'fyord';
// import { Strings } from 'tsbase/Functions/Strings';
// import { Level } from '../core/level/level';
// import { Game } from '../core/module';
// import { CharacterTypes, Images, Routes } from '../enums/module';

// export abstract class AsteroidsLevel extends Level {
//   private wormholeDestination = Routes.LevelOne;
//   private collisionEventRef = Strings.Empty;

//   constructor(protected game = Game.Instance) {
//     super();

//     this.App.Router.Route.Subscribe(async () => {
//       if (!!this.Element) {
//         this.collisionEventRef = this.game.CollisionEvent.Subscribe(() => {
//           const remainingAsteroids = document.querySelectorAll(CharacterTypes.Asteroid) as NodeListOf<AsteroidCharacter>;
//           if (remainingAsteroids.length === 0) {
//             // reveal wormhole
//           }
//         });
//       } else if (this.collisionEventRef) {
//         this.game.CollisionEvent.Cancel(this.collisionEventRef);
//       }
//     });
//   }

//   protected set Background(v: Images) {
//     document.body.style.backgroundImage = `url(${v})`;
//   }

//   protected set WormholeDestination(v: Routes) {
//     this.wormholeDestination = v;
//   }
// }
