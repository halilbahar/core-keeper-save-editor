import { Component, Input, OnInit } from '@angular/core';

import { SelectedItemService } from 'src/app/services/selected-item.service';
import { InventorySlot, ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() isEditable: boolean;
  @Input() objectID: number;
  itemData: ItemData;

  constructor(
    private itemDataService: ItemDataService,
    private selectedItemService: SelectedItemService
  ) {}

  ngOnInit(): void {
    this.itemData = this.itemDataService.getData(this.objectID);
  }

  selectItem(): void {
    this.selectedItemService.setSelectedItem(null, this.isEditable);
  }
}
