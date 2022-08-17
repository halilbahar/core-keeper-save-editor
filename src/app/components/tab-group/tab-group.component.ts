import { Component, ContentChildren, OnInit, QueryList } from '@angular/core';

import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  selectTab(tab: TabComponent): void {
    this.tabs.forEach(t => {
      t.active = false;
    });
    tab.active = true;
  }
}
