import { CdkDrag } from '@angular/cdk/drag-drop';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  TalenTooltipOptions,
  TalentTooltipComponent
} from '~components/talent-tooltip/talent-tooltip.component';

@UntilDestroy()
@Directive({
  selector: '[appTalentTooltip]'
})
export class TalentTooltipDirective {
  @Input() appTalentTooltip: TalenTooltipOptions;

  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay, private elementRef: ElementRef) {}

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

    const portal = new ComponentPortal(TalentTooltipComponent);
    const componentRef = this.overlayRef.attach(portal);
    componentRef.instance.options = this.appTalentTooltip;
  }

  @HostListener('mouseout')
  oneLeave(): void {
    this.destory();
  }

  private destory(): void {
    this.overlayRef.dispose();
  }
}
