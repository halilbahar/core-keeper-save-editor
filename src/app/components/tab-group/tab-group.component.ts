import { Component, ContentChildren, QueryList } from '@angular/core';

import { AesService, CharacterService } from '~services';

import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor(private aesService: AesService, private characterService: CharacterService) {}

  selectTab(tab: TabComponent): void {
    this.tabs.forEach(t => {
      t.active = false;
    });
    tab.active = true;
  }

  /**
   * Import the x.json.enc file with this on file upload event handler.
   * This finds out what x is and decrypts it with the proper private key.
   */
  onFileUpload(files: FileList): void {
    const file = files.item(0);
    const filename = file.name;
    const regex = /(\d{1,2})\.json\.enc/;
    const match = filename.match(regex);
    const index = +match[1];

    this.aesService
      .decryptCharacterSaveFile(file, index)
      .then(character => this.characterService.setCharacter(character, index));
  }

  /**
   * Export the current character with the given index.
   * Create a invisible a tag and click on it so the user can download the file
   */
  export(): void {
    const character = this.characterService.$character.value;
    const index = this.characterService.$index.value;
    this.aesService.encryptCharacterSaveFile(character, index).then(bytes => {
      const blob = new Blob([bytes.buffer], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${index}.json.enc`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }
}
