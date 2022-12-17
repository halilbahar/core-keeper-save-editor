import { CdkDrag } from '@angular/cdk/drag-drop';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ItemTooltipComponent } from '~components/item-tooltip/item-tooltip.component';

@UntilDestroy()
@Directive({
  selector: '[appItemTooltip]'
})
export class ItemTooltipDirective {
  @Input() appItemTooltip: number;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private elementRef: ElementRef, cdkDrag: CdkDrag) {
    // Listen to the on start event. When dragging starts, dispose this tooltip
    cdkDrag.started.pipe(untilDestroyed(this)).subscribe(_ => this.destory());
  }

  ngOnDestroy(): void {
    this.destory();
  }

  @HostListener('mouseenter')
  onEnter(): void {
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

  @HostListener('mouseout')
  oneLeave(): void {
    this.destory();
  }

  private destory(): void {
    if (this.overlayRef) this.overlayRef.dispose();
  }
}
