import { Injectable } from '@angular/core';
import { Character, InventorySlot } from '~models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  
  private character: BehaviorSubject<Character>

  constructor() { 
    this.character = new BehaviorSubject<Character>(undefined)
  }

  setCharacter(character: Character) {
    this.character.next(character)
  }

  getCharacter(): Observable<Character> {
    return this.character.asObservable()
  }
}
