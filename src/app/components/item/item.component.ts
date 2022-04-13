import { Component, OnInit } from '@angular/core';
import { InventorySlot } from '~models';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  item: InventorySlot

  constructor() { }

  ngOnInit(): void {
  }

}
