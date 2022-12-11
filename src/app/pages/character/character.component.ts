import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(character => {
      this.character = character;
      this.isHardcore = character.characterType === 1;

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
}
