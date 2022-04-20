import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CardComponent } from './components/card/card.component';
import { ItemComponent } from './components/item/item.component';

@NgModule({
  declarations: [AppComponent, InventoryComponent, CardComponent, ItemComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
