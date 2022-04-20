import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Character } from '~models';

// eslint-disable-next-line no-restricted-imports
import DefaultCharacter from '../../assets/default_character.json';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  $character: BehaviorSubject<Character>;

  constructor() {
    const defaultCharacter = DefaultCharacter as unknown as Character;
    defaultCharacter.characterGuid = crypto.randomUUID().replace(/-/g, '');
    this.$character = new BehaviorSubject<Character>(defaultCharacter);
  }

  setCharacter(character: Character) {
    this.$character.next(character);
  }
}
