import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { ItemDetail } from '~models';
import { ItemDataService, ItemSetService } from '~services';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.scss']
})
export class ItemTooltipComponent implements OnInit {
  itemDetail: ItemDetail;
  isInvalidItem: boolean;
  @Input() objectId: number;
  @Input() displayReinforcementBonus: boolean;

  @HostBinding('class.tooltip') tooltip = true;

  constructor(private itemDataService: ItemDataService, private itemSetService: ItemSetService) {}

  ngOnInit(): void {
    this.itemDetail = this.itemDataService.getItemDetail(this.objectId);
    this.isInvalidItem = this.itemDetail == null;
    this.itemSetService.highlightBonus(this.itemDetail.objectId, this.itemDetail.setBonus);
  }

  public checkActiveSetBonuses(condition: string) {
    return this.itemSetService.activeConditions.includes(condition);
  }

  public checkActivePieces(piece: string) {
    return this.itemSetService.activePieces.includes(piece);
  }
}
