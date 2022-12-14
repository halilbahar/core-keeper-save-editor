import { Component, HostBinding, Input } from '@angular/core';

import { ItemData } from '~models';
import { ItemDataService, SelectedItemService } from '~services';

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
  private _isSelected: boolean = false;

  @HostBinding('style') style: string;
  @Input() drag: boolean = true;
  @Input() hide: boolean = false;

  itemData: ItemData;
  durabilityProgress?: number;
  durabilityBarColor?: string;
  isItemInvalid: boolean;

  constructor(
    private itemDataService: ItemDataService,
    public selectedItemService: SelectedItemService
  ) {}

  @Input() set options({
    scale = 1,
    objectID,
    amount,
    placeholder = -1,
    isSelected = false
  }: {
    scale?: number;
    objectID: number;
    amount?: number;
    placeholder?: number;
    isSelected?: boolean;
  }) {
    this._scale = scale;
    this._objectID = objectID;
    this._amount = amount;
    this._placeholder = placeholder;
    this._isSelected = isSelected;
    this.durabilityProgress = null;
    this.durabilityBarColor = null;

    this.itemData = this.itemDataService.getData(objectID);
    // If itemData is null and the objectID is not 0. If it is zero itemData is also null
    this.isItemInvalid = this.itemData == null && objectID !== 0;
    if (amount && this.itemData?.initialAmount > 1) {
      this.durabilityProgress = (amount / this.itemData.initialAmount) * 100;
      this.durabilityBarColor = this.mapColor(this.durabilityProgress);
    }

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
    let rarity = this.itemData?.rarity;
    // Poor: -1 and Common: 0 have the same border
    if (rarity == null || rarity == -1) {
      rarity = 0;
    }
    // If the item is selected, use the -1 border (selected item border)
    if (this._isSelected) {
      rarity = -1;
    }

    const backgroundColor = this._placeholder !== -1 ? 'transparent' : '#3d260d';
    const borderUrl = `url("assets/border/item/${rarity}.png")`;
    this.style = `--individual-scale: ${this._scale}; --background: ${backgroundColor}; --border: ${borderUrl}`;
  }
}
