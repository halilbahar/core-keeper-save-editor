import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { ItemCategories } from 'src/app/enums/item-categories';
import { InventorySlot, ItemData } from '~models';
import { ItemDataService } from '~services';

@Component({
  selector: 'app-item-browser',
  templateUrl: './item-browser.component.html',
  styleUrls: ['./item-browser.component.scss']
})
export class ItemBrowserComponent implements OnInit {
  items: ItemData[];
  filteredItems: InventorySlot[] = [];
  categories = ItemCategories;

  filterTerm: string = "";
  selectedCategory: number = -1;

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 500;

  constructor(private itemDataService: ItemDataService) {}

  ngOnInit(): void {
    this.items = this.itemDataService.items;
    this.subscription = this.modelChanged.pipe(debounceTime(this.debounceTime)).subscribe(data => {
      this.filterTerm = data;
      this.filterItems();
    });
    this.filterItems();
  }

  onFilterInput(event) {
    this.modelChanged.next(event.target.value);
  }

  filterItems() {
    this.filteredItems = [];
    let categorizedItems = [];

    console.log(this.selectedCategory, typeof this.selectedCategory);
    
    if (this.selectedCategory !== -1) {
      for (let item of this.items) {
        if (item.objectType == this.selectedCategory) {
          categorizedItems.push(item);
        }
      }
    } else {
      categorizedItems = [...this.items];
    }


    for (let item of categorizedItems) {
      if (isNaN(Number(this.filterTerm)) || Number(this.filterTerm) == 0) {
        if (item.name.toLowerCase().includes(this.filterTerm.toLowerCase())) {
          this.filteredItems.push({
            objectID: item.objectID,
            amount: item.initialAmount,
            variation: 0,
            variationUpdateCount: 0
          } as InventorySlot);
        }
      } else {
        if (item.objectID === Number(this.filterTerm)) {
          this.filteredItems.push({
            objectID: item.objectID,
            amount: item.initialAmount,
            variation: 0,
            variationUpdateCount: 0
          } as InventorySlot);
        }
      }
    }  
  }

  getCategoryNames(): string[] {
    return Object.keys(ItemCategories).filter(key => !isNaN(Number(ItemCategories[key])));
  }

  onCategorySelect(category: number) {
    this.selectedCategory = +category;
    this.filterItems();
  }
  
}