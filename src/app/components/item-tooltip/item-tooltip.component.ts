import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { ItemDetail } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.scss']
})
export class ItemTooltipComponent implements OnInit {
  itemDetail: ItemDetail;
  @Input() objectId: number;

  @HostBinding('class.tooltip') tooltip = true;

  constructor(private itemDataService: ItemDataService) {}

  ngOnInit(): void {
    this.itemDetail = this.itemDataService.getItemDetail(this.objectId);
  }
}
