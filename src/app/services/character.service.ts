import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Bag } from '~enums';
import { Character } from '~models';

// eslint-disable-next-line no-restricted-imports
import DefaultCharacter from '../../assets/default_character.json';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  $character: BehaviorSubject<Character> = new BehaviorSubject(null);
  $index: BehaviorSubject<number> = new BehaviorSubject(null);
  $bag: BehaviorSubject<Bag> = new BehaviorSubject(null);

  constructor() {
    const defaultCharacter = DefaultCharacter as unknown as Character;
    defaultCharacter.characterGuid = crypto.randomUUID().replace(/-/g, '');
    this.setCharacter(defaultCharacter, 0);
  }

  /**
   * Set the current Character which the application will edit and the index how the file was encrypted
   */
  setCharacter(character: Character, index: number): void {
    this.$character.next(character);
    this.$index.next(index);
    const objectID = character.inventory[58].objectID;
    const bag = objectID in Bag ? objectID : Bag.None;
    this.$bag.next(bag);
  }
}
