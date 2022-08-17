import { Component, Input } from '@angular/core';

import { ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.scss']
})
export class ItemTooltipComponent {
  @Input() item: ItemData;

  constructor(private itemDataService: ItemDataService) {}

  getRarityColor(): string {
    return this.itemDataService.getRarityColor(this.item);
  }
}
