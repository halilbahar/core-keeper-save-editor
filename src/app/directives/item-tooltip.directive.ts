import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { CardComponent } from '~components/card/card.component';
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
            originX: 'end',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center'
          }
        ])
    });

    console.log(this.tooltipItemData);

    const portal = new ComponentPortal(CardComponent);
    this.overlayRef.attach(portal);
  }

  @HostListener('mouseleave', [])
  oneLeave(): void {
    this.overlayRef.dispose();
  }
}
