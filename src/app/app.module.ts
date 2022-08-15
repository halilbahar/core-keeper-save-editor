import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { CharacterComponent } from './components/character/character.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ItemBrowserComponent } from './components/item-browser/item-browser.component';
import { ItemTooltipComponent } from './components/item-tooltip/item-tooltip.component';
import { ItemComponent } from './components/item/item.component';
import { SelectionDetailComponent } from './components/selection-detail/selection-detail.component';
import { SkillComponent } from './components/skill/skill.component';
import { FitToParentDirective } from './directives/fit-to-parent.directive';
import { ItemTooltipDirective } from './directives/item-tooltip.directive';

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    CardComponent,
    ItemComponent,
    ItemBrowserComponent,
    EquipmentComponent,
    SkillComponent,
    SelectionDetailComponent,
    CharacterComponent,
    FitToParentDirective,
    ItemTooltipDirective,
    ItemTooltipComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, OverlayModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
