import { Component, Input, OnInit } from '@angular/core';

import { ItemDetail } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.scss']
})
export class ItemTooltipComponent implements OnInit {
  itemDetail: ItemDetail;
  isInvalidItem: boolean;
  @Input() objectId: number;

  constructor(private itemDataService: ItemDataService) {}

  ngOnInit(): void {
    this.itemDetail = this.itemDataService.getItemDetail(this.objectId);
    this.isInvalidItem = this.itemDetail == null;
  }
}
