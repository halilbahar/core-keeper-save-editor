import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { ItemTooltipComponent } from './components/item-tooltip/item-tooltip.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TabGroupComponent } from './components/tab-group/tab-group.component';
import { TabComponent } from './components/tab-group/tab/tab.component';
import { ItemTooltipDirective } from './directives/item-tooltip.directive';
import { CharacterComponent } from './pages/character/character.component';
import { EquipmentComponent } from './pages/items/equipment/equipment.component';
import { InventoryComponent } from './pages/items/inventory/inventory.component';
import { ItemBrowserComponent } from './pages/items/item-browser/item-browser.component';
import { ItemListComponent } from './pages/items/item-list/item-list.component';
import { ItemComponent } from './pages/items/item/item.component';
import { ItemsComponent } from './pages/items/items.component';
import { SkillComponent } from './pages/skills/skill/skill.component';
import { SkillsComponent } from './pages/skills/skills.component';

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
    ItemListComponent,
    TabGroupComponent,
    TabComponent,
    NavBarComponent,
    ItemsComponent,
    SkillsComponent,
    CharacterComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, OverlayModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
