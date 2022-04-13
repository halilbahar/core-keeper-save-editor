import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { InventorySlot, ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() item: InventorySlot;
  itemData: ItemData;
  itemCount: number;

  constructor(private itemDataService: ItemDataService, public elementRef: ElementRef) {}

  ngOnInit(): void {
    this.itemData = this.itemDataService.getData(this.item.objectID);
    this.itemCount = this.itemDataService.items.length;
  }
}
