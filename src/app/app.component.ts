import { Component } from '@angular/core';

import { Character } from '~models';
import { AesService, CharacterService } from '~services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'core-keeper-save-editor';

  constructor(private aes: AesService, private characterService: CharacterService) {}

  character? : Character
  handleFileInput(event: any): void {
    // TODO: use this code as an example and delete this method later
    const element = event.currentTarget;
    let fileList = element.files;
    const file = fileList?.item(0);
    if (file) {
      this.aes.decryptCharacterSaveFile(file, 1).then(character => {
        this.characterService.setCharacter(character)
        this.characterService.$character.subscribe(value => {
          this.character = value
        });
      });
    }
  }

  save(): void {
    // TODO: use this code as an example and delete this method later
    this.aes.encryptCharacterSaveFile(this.character!, 1).then(bytes => {
      var blob = new Blob([bytes.buffer], {
        type: 'application/octet-stream'
      });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var fileName = '1.json.enc';
      link.download = fileName;
      link.click();
    });
  }
}
