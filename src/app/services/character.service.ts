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
  $index: BehaviorSubject<number>;

  constructor() {
    const defaultCharacter = DefaultCharacter as unknown as Character;
    defaultCharacter.characterGuid = crypto.randomUUID().replace(/-/g, '');
    this.$character = new BehaviorSubject<Character>(defaultCharacter);
    this.$index = new BehaviorSubject<number>(0);
  }

  /**
   * Set the current Character which the application will edit
   * @param character Character
   */
  setCharacter(character: Character): void {
    this.$character.next(character);
  }

  /**
   * Set the index, so we know how to encrypt it later
   */
  setIndex(index: number): void {
    this.$index.next(index);
  }
}
