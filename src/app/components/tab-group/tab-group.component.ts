import { Component, ContentChildren, QueryList } from '@angular/core';

import { InaccessibleItemsComponent } from '~components/dialog/inaccessible-items/inaccessible-items.component';
import { AesService, CharacterService, DialogService } from '~services';

import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  constructor(
    private aesService: AesService,
    private characterService: CharacterService,
    private dialogService: DialogService
  ) {}

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

    this.aesService.decryptCharacterSaveFile(file, index).then(character => {
      this.characterService.setCharacter(character, index);
      this.characterService.store();
    });
  }

  /**
   * Based on the bag equipped bag and filled bag slots, display a warning message.
   */
  export(): void {
    const character = this.characterService.$character.value;
    const bag = this.characterService.$bag.value;
    const bagSize = this.characterService.getBagSize(bag);

    const bagSlots = character.inventory.slice(30 + bagSize, 50);
    // When we find a slot that is hidden due to a insufficient bag size, we show the dialog.
    let showWarningDialog = false;
    for (const slot of bagSlots) {
      if (slot.objectID !== 0) {
        showWarningDialog = true;
        break;
      }
    }

    if (showWarningDialog) {
      this.dialogService
        .open(InaccessibleItemsComponent)
        .afterClosed()
        .subscribe(result => {
          if (result) {
            this.save();
          }
        });
    } else {
      this.save();
    }
  }

  /**
   * Export the current character with the given index.
   * Create a invisible a tag and click on it so the user can download the file
   */
  private save(): void {
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
