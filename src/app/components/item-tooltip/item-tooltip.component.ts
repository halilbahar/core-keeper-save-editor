import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { ItemDetail, SetBonusDetail } from '~models';
import { ItemDataService, ItemSetService } from '~services';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.scss']
})
export class ItemTooltipComponent implements OnInit {
  itemDetail: ItemDetail;
  isInvalidItem: boolean;
  setBonusDetail: SetBonusDetail;
  @Input() objectId: number;
  @Input() displayReinforcementBonus: boolean;

  @HostBinding('class.tooltip') tooltip = true;

  constructor(private itemDataService: ItemDataService, private itemSetService: ItemSetService) {}

  ngOnInit(): void {
    this.itemDetail = this.itemDataService.getItemDetail(this.objectId);
    this.isInvalidItem = this.itemDetail == null;
    this.setBonusDetail = this.itemSetService.getSetBonusDetail(this.itemDetail.objectId);
  }
}
