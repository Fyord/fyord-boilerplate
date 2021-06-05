import { LevelOne } from './asteroids/levelOne/levelOne';
import { LevelTwo } from './asteroids/levelTwo/levelTwo';
import { LevelThree } from './asteroids/levelThree/levelThree';
import { LevelFour } from './asteroids/levelFour/levelFour';
import { GameOver } from './asteroids/gameOver/gameOver';
import { Home } from './asteroids/home/home';

export const pages = [
  new Home(false),
  new LevelOne(),
  new LevelTwo(),
  new LevelThree(),
  new LevelFour(),
  new GameOver(false)
];
