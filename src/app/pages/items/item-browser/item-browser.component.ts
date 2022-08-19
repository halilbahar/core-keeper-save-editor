import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, Subject } from 'rxjs';

import { ItemCategories } from '~enums';
import { ItemDataService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-item-browser',
  templateUrl: './item-browser.component.html',
  styleUrls: ['./item-browser.component.scss']
})
export class ItemBrowserComponent implements OnInit {
  private $modelChanged: Subject<string> = new Subject();

  filteredObjectIDs: number[] = [];
  itemCategories = ItemCategories;

  filterTerm: string = '';
  selectedCategory: number = -1;

  inventory_ids: string[] = [];

  constructor(private itemDataService: ItemDataService) {}

  /**
   * Initialize the items and a subscription which uses a debounce method.
   * This way the form will only be alerted after the last keystrok + 500ms
   */
  ngOnInit(): void {
    this.$modelChanged
      .pipe(debounceTime(500))
      .pipe(untilDestroyed(this))
      .subscribe(data => {
        this.filterTerm = data;
        this.filterItems();
      });
    this.filterItems();

    for (let i = 0; i < 66; i++) {
      this.inventory_ids.push(`inventory-${i}`);
    }
  }

  /**
   * Event handler for the input field.
   * @param event InputEvent
   */
  onFilterInput(event) {
    this.$modelChanged.next(event.target.value);
  }

  /**
   * Event handler for the select field.
   * @param category id
   */
  onCategorySelect(category: number) {
    this.selectedCategory = +category;
    this.filterItems();
  }

  /**
   * Filter the items by category whether the items belong to the current category (-1 for excluding this mechanisim)
   * and by name / objectID
   */
  filterItems() {
    this.filteredObjectIDs = [];
    let items = [];

    // Check if we need to filter by category
    if (this.selectedCategory !== -1) {
      items = this.itemDataService.items.filter(item => item.objectType == this.selectedCategory);
    } else {
      items = [...this.itemDataService.items];
    }

    // Exclude everything that does not match (either as number or as string)
    for (let item of items) {
      const isANumber = isNaN(Number(this.filterTerm));
      if (
        item.name.toLowerCase().includes(this.filterTerm.toLowerCase()) ||
        (isANumber && item.objectID === Number(this.filterTerm))
      ) {
        this.filteredObjectIDs.push(item.objectID);
      }
    }
  }

  /**
   * @returns all labels of ItemCategories
   */
  getCategoryNames(): string[] {
    // This way the numbered version is filtered out
    return Object.values(ItemCategories).filter(value => typeof value === 'string') as string[];
  }
}
