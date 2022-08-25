import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { ItemTooltipComponent } from './components/item-tooltip/item-tooltip.component';
import { TabGroupComponent } from './components/tab-group/tab-group.component';
import { TabComponent } from './components/tab-group/tab/tab.component';
import { ItemTooltipDirective } from './directives/item-tooltip.directive';
import { CharacterComponent } from './pages/character/character.component';
import { EquipmentComponent } from './pages/items/equipment/equipment.component';
import { InventoryComponent } from './pages/items/inventory/inventory.component';
import { ItemBrowserComponent } from './pages/items/item-browser/item-browser.component';
import { ItemDetailComponent } from './pages/items/item-detail/item-detail.component';
import { ItemComponent } from './pages/items/item/item.component';
import { ItemsComponent } from './pages/items/items.component';
import { SkillComponent } from './pages/skills/skill/skill.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { InventoryPipe } from './pipes/inventory.pipe';

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    CardComponent,
    ItemComponent,
    ItemBrowserComponent,
    EquipmentComponent,
    SkillComponent,
    ItemTooltipDirective,
    ItemTooltipComponent,
    TabGroupComponent,
    TabComponent,
    ItemsComponent,
    SkillsComponent,
    CharacterComponent,
    ItemDetailComponent,
    InventoryPipe
  ],
  imports: [BrowserModule, FormsModule, OverlayModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
