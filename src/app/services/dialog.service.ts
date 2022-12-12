import { ComponentType, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private overlay: Overlay) {}

  open<T>(component: ComponentType<T>) {
    // Globally centered position strategy
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    // Create the overlay with customizable options
    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
      panelClass: 'overlay-panel'
    });

    // Attach component portal to the overlay
    const portal = new ComponentPortal(component);
    overlayRef.attach(portal);
  }

  static DialogRef = class {
    private afterClosedSubject = new Subject<any>();

    constructor(private overlayRef: OverlayRef) {}

    /**
     * An Observable that notifies when the overlay has closed
     */
    public afterClosed(): Observable<any> {
      return this.afterClosedSubject.asObservable();
    }
  };
}
