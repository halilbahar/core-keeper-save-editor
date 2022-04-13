import { Component, Input, OnInit } from '@angular/core';
import { InventorySlot, ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input() item: InventorySlot
  itemData: ItemData

  constructor(private itemDataService: ItemDataService) { }

  ngOnInit(): void {
    this.itemData = this.itemDataService.getData(this.item.objectID)
    console.log(this.itemData);
    
  }

}
