import { Component, OnInit } from '@angular/core';

import { InventorySlot } from '~models';
import { CharacterService } from '~services';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory: InventorySlot[];

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.characterService.$character.subscribe(value => {
      this.inventory = value.inventory;
    });
  }
}
