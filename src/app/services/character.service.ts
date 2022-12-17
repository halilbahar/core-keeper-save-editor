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
    const characerJsonInStorage = localStorage.getItem('core-keeper-save-editor.character');
    const characterIndexInStorage = localStorage.getItem('core-keeper-save-editor.index');
    if (characerJsonInStorage != null && characterIndexInStorage != null) {
      const character = JSON.parse(characerJsonInStorage) as Character;
      this.setCharacter(character, +characterIndexInStorage);
    } else {
      this.setCharacter(this.getDefaultCharacterWithRandomGUID(), 0);
    }
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

    // Skill are added later to the file, when earned the first xp
    // Create them if they dont exist
    for (let i = 0; i < 9; i++) {
      const skill = character.skills.find(skill => skill.skillID === i);
      if (skill == null) {
        character.skills.push({ skillID: i, value: 0 });
        character.skillTalentTreeDatas.push({
          skillTreeID: i,
          points: [0, 0, 0, 0, 0, 0, 0]
        });
      } else {
        const skillTree = character.skillTalentTreeDatas.find(talent => talent.skillTreeID === i);
        // If nothing was skilled, the skillTree is not initialized so we create one
        if (skillTree == null) {
          character.skillTalentTreeDatas.push({
            skillTreeID: i,
            points: [0, 0, 0, 0, 0, 0, 0]
          });
        } else {
          // If you only level up the first talent, the other ones are not created, fill them up
          for (let i = skillTree.points.length; i < 7; i++) {
            skillTree.points[i] = 0;
          }
        }
      }
    }

    // And afterwards sort them so it looks like the game ui when rendering them in a loop
    character.skills.sort((a, b) => a.skillID - b.skillID);
    character.skillTalentTreeDatas.sort((a, b) => a.skillTreeID - b.skillTreeID);
  }

  /**
   * Save the current character into local storage.
   * This value will be loaded when you load the site again (constructor of this service)
   */
  store(): void {
    const character = this.$character.value;
    const characterJson = JSON.stringify(character);
    const characterIndex = this.$index.value;
    localStorage.setItem('core-keeper-save-editor.character', characterJson);
    localStorage.setItem('core-keeper-save-editor.index', characterIndex + '');
  }

  /**
   * Load the default character and update localstorage
   */
  resetToDefaultCharacter() {
    const defaultCharacter = this.getDefaultCharacterWithRandomGUID();
    this.setCharacter(defaultCharacter, 0);
  }

  /**
   * @param bag
   * @returns how many slot the given bag has.
   */
  getBagSize(bag: Bag): number {
    if (!Object.values(Bag).includes(bag) || bag === Bag.None) {
      return 0;
    }

    switch (bag) {
      case Bag.CavePouch:
        return 5;
      case Bag.ExplorerBackpack:
        return 10;
      case Bag.GhormsStomachBag:
        return 12;
      case Bag.ScarletShellBackpack:
        return 15;
      case Bag.MorphasBubbleBag:
      case Bag.OctarineBag:
        return 20;
    }
  }

  /**
   * Removes the item at the specified index from the inventory
   */
  removeItemFromInventory(index: number): void {
    const inventory = this.$character.value.inventory;
    inventory[index] = {
      objectID: 0,
      amount: 0,
      variation: 0,
      variationUpdateCount: 0
    };
    this.$character.next({ ...this.$character.value, inventory });
    this.store();
  }

  /**
   * @returns default character with random guid
   */
  private getDefaultCharacterWithRandomGUID(): Character {
    const defaultCharacter = JSON.parse(JSON.stringify(DefaultCharacter)) as Character;
    defaultCharacter.characterGuid = crypto.randomUUID().replace(/-/g, '');
    return defaultCharacter;
  }
}
