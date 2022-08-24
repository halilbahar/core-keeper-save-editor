import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { InventorySlot } from '~models';
import { CharacterService, DragNDropService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  equipmentSlots: InventorySlot[];
  indexToHide: number;
  placeholder = [0, 1, 2, 3, 4, 4, 5, 6];

  constructor(
    private characterService: CharacterService,
    public dragNDropService: DragNDropService
  ) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(character => {
      this.equipmentSlots = character.inventory.slice(51, 58 + 1);
    });

    this.dragNDropService.$indexToHide
      .pipe(untilDestroyed(this))
      .subscribe(indexToHide => (this.indexToHide = indexToHide));
  }
}
