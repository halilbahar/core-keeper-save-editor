import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { CardComponent } from '~components/card/card.component';
import { ItemTooltipComponent } from '~components/item-tooltip/item-tooltip.component';
import { TabGroupComponent } from '~components/tab-group/tab-group.component';
import { TabComponent } from '~components/tab-group/tab/tab.component';

import { AppComponent } from './app.component';
import { DebugComponent } from './components/debug/debug.component';
import { ItemTooltipDirective } from './directives';
import { CharacterComponent } from './pages/character/character.component';
import { EquipmentComponent } from './pages/items/components/equipment/equipment.component';
import { InventoryComponent } from './pages/items/components/inventory/inventory.component';
import { ItemBrowserComponent } from './pages/items/components/item-browser/item-browser.component';
import { ItemDetailComponent } from './pages/items/components/item-detail/item-detail.component';
import { ItemComponent } from './pages/items/components/item/item.component';
import { ItemsComponent } from './pages/items/items.page.component';
import { SkillListComponent } from './pages/skill-page/components/skill-list/skill-list.component';
import { SkillComponent } from './pages/skill-page/components/skill/skill.component';
import { TalentTreeComponent } from './pages/skill-page/components/talent-tree/talent-tree.component';
import { TalentComponent } from './pages/skill-page/components/talent/talent.component';
import { SkillPageComponent } from './pages/skill-page/skill.page.component';
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
    SkillPageComponent,
    CharacterComponent,
    ItemDetailComponent,
    TalentComponent,
    TalentTreeComponent,
    SkillListComponent,
    InventoryPipe,
    DebugComponent
  ],
  imports: [BrowserModule, FormsModule, OverlayModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
