import { Injectable } from '@angular/core';
import { Character, InventorySlot } from '~models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  
  $character: BehaviorSubject<Character> = new BehaviorSubject<Character>(undefined)

  constructor() {}

  setCharacter(character: Character) {
    this.$character.next(character)
  }
}
