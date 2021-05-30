import { Page } from 'fyord';
import { Game } from '../game/game';

export abstract class Level extends Page {
  constructor(protected game = Game.Instance) {
    super();
  }
}
