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
  private _placeholder: number = -1;

  @HostBinding('style') style: string;
  @Input() drag: boolean = false;
  @Input() hide: boolean = false;

  itemData: ItemData;
  durabilityProgress?: number;
  durabilityBarColor?: string;

  constructor(private itemDataService: ItemDataService) {}

  @Input() set scale(value) {
    this._scale = value;
    this.updateStyles();
  }

  @Input() set objectID(value) {
    this._objectID = value;
    this.itemData = this.itemDataService.getData(value);
  }

  @Input() set amount(value) {
    this._amount = value;
    if (value && this.itemData?.initialAmount > 1) {
      this.durabilityProgress = (value / this.itemData.initialAmount) * 100;
      this.durabilityBarColor = this.mapColor(this.durabilityProgress);
    }
  }

  @Input() set placeholder(value) {
    this._placeholder = value;
    this.updateStyles();
  }

  get scale(): number {
    return this._scale;
  }

  get objectID(): number {
    return this._objectID;
  }

  get amount(): number {
    return this._amount;
  }

  get placeholder(): number {
    return this._placeholder;
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

  private updateStyles(): void {
    this.style = `--individual-scale: ${this._scale};`;
  }
}
