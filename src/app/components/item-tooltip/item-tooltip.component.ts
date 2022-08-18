import { Component, Input, OnInit } from '@angular/core';

import { ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.scss']
})
export class ItemTooltipComponent implements OnInit {
  @Input() item: ItemData;
  rarityColor: string;

  constructor(private itemDataService: ItemDataService) {}

  ngOnInit(): void {
    this.rarityColor = this.itemDataService.getRarityColor(this.item.rarity);
  }
}
