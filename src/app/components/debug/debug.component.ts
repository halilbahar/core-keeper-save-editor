import { Component } from '@angular/core';

import { CharacterService } from '~services';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
  constructor(public characterService: CharacterService) {}
}
