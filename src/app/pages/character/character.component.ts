import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Soul } from '~enums';
import { Character } from '~models';
import { CharacterService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {
  character: Character;
  currentName: string;
  isHardcore: boolean;
  index: number;
  hasSoulsUnlocked: boolean;
  hasAzeosUnlocked: boolean;
  hasOmorothUnlocked: boolean;
  hasScarabUnlocked: boolean;

  @ViewChild('isHardcoreCheckbox') checkbox: ElementRef<HTMLInputElement>;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(character => {
      this.character = character;
      this.isHardcore = character.characterType === 1;
      this.hasSoulsUnlocked = character.hasUnlockedSouls;
      this.hasAzeosUnlocked = character.collectedSouls.find(soulId => soulId === 1) != null;
      this.hasOmorothUnlocked = character.collectedSouls.find(soulId => soulId === 2) != null;
      this.hasScarabUnlocked = character.collectedSouls.find(soulId => soulId === 3) != null;

      const encodedBytes = [];
      for (let i = 0; i < 16; i++) {
        const lastDigits = String(i).padStart(2, '0');
        const value = character.characterCustomization.name.bytes.offset0000['byte00' + lastDigits];
        if (value !== 0) {
          encodedBytes.push(value);
        }
      }

      const encodedName = Uint8Array.from(encodedBytes);
      this.currentName = new TextDecoder('utf-8').decode(encodedName);
    });

    this.characterService.$index
      .pipe(untilDestroyed(this))
      .subscribe(index => (this.index = index + 1));
  }

  /**
   * When a change event happens, we save the name in the character json.
   * This can only happen if the encoded array is not longer than 16
   * @param event
   */
  onNameChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const encoded = new TextEncoder().encode(target.value);

    if (encoded.length > 16) {
      target.value = this.currentName;
    } else {
      const name = this.character.characterCustomization.name;
      this.currentName = target.value;
      // Also set the length of the name
      name.utf8LengthInBytes = encoded.length;
      // We need to apply all the bytes to the offset0000. If encoded.length < 16 we need to fill the rest with 0
      for (let i = 0; i < 16; i++) {
        const value = i < encoded.length ? encoded[i] : 0;
        const lastDigits = String(i).padStart(2, '0');
        name.bytes.offset0000['byte00' + lastDigits] = value;
      }

      this.characterService.store();
    }
  }

  /**
   * Event handler for the checkbox. When the state changes we update the character
   * @param event
   */
  onHardcoreChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.character.characterType = target.checked ? 1 : 0;
    this.characterService.store();
  }

  /**
   * When the index changes, we save it so we can recall it when we export the file
   * @param event
   */
  onIndexChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const index = +target.value;

    if (index < 1 || 30 < index) {
      target.value = '' + this.index;
    } else {
      // We display the Slot index which starts by 1. The files on the other hand start with 0
      const correctIndex = index - 1;
      this.characterService.$index.next(correctIndex);
      this.characterService.store();
    }
  }

  /**
   * Event handler for the change event on the enable soul input field.
   */
  onEnableSoulsChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.character.hasUnlockedSouls = target.checked;
    // Reset the souls when disabling souls generally
    if (!target.checked) {
      this.hasAzeosUnlocked = false;
      this.hasOmorothUnlocked = false;
      this.hasScarabUnlocked = false;
      this.character.collectedSouls = [];
    }

    this.characterService.store();
  }

  /**
   * Event handler for the given soul.
   * @param event
   * @param soul
   */
  onSoulsChange(event: Event, soul: Soul): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    const collectedSouls = this.character.collectedSouls;
    // Reset the disabledSouls when enabling / disabling souls.
    // We don't want the game to be in a wrong state
    this.character.disabledSoulPowers = [];

    if (checked) {
      collectedSouls.push(soul);
      collectedSouls.sort();
    } else {
      const indexOfSoul = collectedSouls.indexOf(soul);
      if (indexOfSoul > -1) {
        // only splice array when item is found
        // remove one item only
        collectedSouls.splice(indexOfSoul, 1);
      }
    }

    this.characterService.store();
  }

  /**
   * Load the default character.
   */
  resetCharacter(): void {
    this.characterService.resetToDefaultCharacter();
    this.characterService.store();
  }
}
