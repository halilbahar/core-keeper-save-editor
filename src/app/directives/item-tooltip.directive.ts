import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { ItemTooltipComponent } from '~components/item-tooltip/item-tooltip.component';
import { ItemData } from '~models';

@Directive({
  selector: '[appItemTooltip]'
})
export class ItemTooltipDirective {
  @Input() tooltipItemData: ItemData;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private elementRef: ElementRef) {}

  @HostListener('mouseenter', ['$event'])
  onEnter(event): void {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          }
        ])
    });

    const portal = new ComponentPortal(ItemTooltipComponent);
    const componentRef = this.overlayRef.attach(portal);
    componentRef.instance.item = this.tooltipItemData;
  }

  @HostListener('mouseleave', [])
  oneLeave(): void {
    this.overlayRef.dispose();
  }
}
