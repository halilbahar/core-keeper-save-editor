import { Component, HostBinding, Input } from '@angular/core';

import { ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  private _objectID: number;
  private _scale: number = 1;
  private _amount: number;
  @HostBinding('style') style: string = `--individual-scale: ${this._scale};`;
  @Input() drag: boolean = false;
  itemData: ItemData;
  durabilityProgress?: number;
  durabilityBarColor?: string;

  @Input() set scale(value) {
    this._scale = value;
    this.style = `--individual-scale: ${this._scale};`;
  }

  @Input() set objectID(value) {
    this._objectID = value;
    this.itemData = this.itemDataService.getData(value);
  }

  @Input() set amount(value) {
    this._amount = value;
    if (value && this.itemData.initialAmount > 1) {
      this.durabilityProgress = (value / this.itemData.initialAmount) * 100;
      this.durabilityBarColor = this.mapColor(this.durabilityProgress);
    }
  }

  constructor(private itemDataService: ItemDataService) {}

  get amount() {
    return this._amount;
  }

  private mapColor(progress: number): string {
    const fullDurability = { r: 0, g: 240, b: 105 };
    const lowDurability = { r: 245, g: 0, b: 65 };

    const r =
      lowDurability.r - Math.round(Math.abs(fullDurability.r - lowDurability.r) * 0.01 * progress);
    const g =
      lowDurability.g + Math.round(Math.abs(fullDurability.g - lowDurability.g) * 0.01 * progress);
    const b =
      lowDurability.b + Math.round(Math.abs(fullDurability.b - lowDurability.b) * 0.01 * progress);

    return `rgb(${r},${g},${b})`;
  }
}
