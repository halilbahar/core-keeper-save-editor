import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { ItemTooltipComponent } from '~components/item-tooltip/item-tooltip.component';

@Directive({
  selector: '[appItemTooltip]'
})
export class ItemTooltipDirective {
  @Input() appItemTooltip: number;

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
    componentRef.instance.objectId = this.appItemTooltip;
  }

  @HostListener('mouseleave', [])
  oneLeave(): void {
    this.overlayRef.dispose();
  }
}
