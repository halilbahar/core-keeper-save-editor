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
  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(character => {
      this.character = character;

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
  }

  /**
   * When a change event happens, we save the name in the character json.
   * This can only happen if the encoded array is not longer than 16
   * @param event
   */
  onChange(event: Event): void {
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
}
