import { Component, Input, OnInit } from '@angular/core';

import { ItemData } from '~models';

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrls: ['./item-tooltip.component.scss']
})
export class ItemTooltipComponent implements OnInit {
  @Input() item: ItemData;

  constructor() {}

  ngOnInit(): void {}

  getRarityColor(): string {
    switch (this.item.rarity) {
      case 1:
        return '#38c54f';
        break;
      case 2:
        return '#328aff';
        break;
      case 3:
        return '#cd3bbd';
        break;
      case 4:
        return '#ffb426';
        break;
      default:
        return '#ffffff';
        break;
    }
  }
}
